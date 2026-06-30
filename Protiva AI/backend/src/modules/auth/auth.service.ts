import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../database/models/user.model.js';
import { Profile } from '../../database/models/profile.model.js';
import { config } from '../../config/index.js';
import { AppError } from '../../middleware/error.js';

export interface ITokenPayload {
  id: string;
  role: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Generates a pair of JWT tokens (Access and Refresh)
   */
  private static generateTokens(payload: ITokenPayload) {
    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtAccessExpiration as any
    });

    const refreshToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtRefreshExpiration as any
    });

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user
   */
  public static async register(data: {
    email: string;
    passwordHash: string;
    fullName: string;
  }): Promise<IAuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.passwordHash, salt);

    // Create user
    const user = new User({
      email: data.email,
      passwordHash,
      provider: 'local',
      isVerified: false,
      role: 'USER',
      status: 'ACTIVE'
    });
    await user.save();

    // Create user profile
    const profile = new Profile({
      userId: user._id,
      fullName: data.fullName,
      languages: ['en'],
      preferences: {
        darkMode: false,
        language: 'en',
        notificationsEnabled: true
      }
    });
    await profile.save();

    // Generate tokens
    const tokens = this.generateTokens({ id: user._id.toString(), role: user.role });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: profile.fullName
      },
      ...tokens
    };
  }

  /**
   * Login a user
   */
  public static async login(credentials: {
    email: string;
    passwordHash: string;
  }): Promise<IAuthResponse> {
    // Find user
    const user = await User.findOne({ email: credentials.email });
    if (!user || user.provider !== 'local' || !user.passwordHash) {
      throw new AppError('Invalid email or password', 400);
    }

    // Validate password
    const isMatch = await bcrypt.compare(credentials.passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 400);
    }

    // Check account status
    if (user.status !== 'ACTIVE') {
      throw new AppError(`Account is ${user.status.toLowerCase()}`, 403);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Get user profile
    const profile = await Profile.findOne({ userId: user._id });
    const fullName = profile ? profile.fullName : '';

    // Generate tokens
    const tokens = this.generateTokens({ id: user._id.toString(), role: user.role });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName
      },
      ...tokens
    };
  }

  /**
   * Refresh credentials using refresh token
   */
  public static async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as ITokenPayload;
      
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      if (user.status !== 'ACTIVE') {
        throw new AppError(`Account is ${user.status.toLowerCase()}`, 403);
      }

      // Generate new tokens
      return this.generateTokens({ id: user._id.toString(), role: user.role });
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  /**
   * Fetch current user and profile context
   */
  public static async getMe(userId: string) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const profile = await Profile.findOne({ userId: user._id });

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      provider: user.provider,
      isVerified: user.isVerified,
      status: user.status,
      lastLogin: user.lastLogin,
      profile: profile || null
    };
  }
}
