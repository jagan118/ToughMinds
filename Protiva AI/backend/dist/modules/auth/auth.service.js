"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = require("../../database/models/user.model.js");
const profile_model_js_1 = require("../../database/models/profile.model.js");
const index_js_1 = require("../../config/index.js");
const error_js_1 = require("../../middleware/error.js");
class AuthService {
    /**
     * Generates a pair of JWT tokens (Access and Refresh)
     */
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, index_js_1.config.jwtSecret, {
            expiresIn: index_js_1.config.jwtAccessExpiration
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, index_js_1.config.jwtSecret, {
            expiresIn: index_js_1.config.jwtRefreshExpiration
        });
        return { accessToken, refreshToken };
    }
    /**
     * Register a new user
     */
    static async register(data) {
        // Check if user already exists
        const existingUser = await user_model_js_1.User.findOne({ email: data.email });
        if (existingUser) {
            throw new error_js_1.AppError('User with this email already exists', 400);
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.passwordHash, salt);
        // Create user
        const user = new user_model_js_1.User({
            email: data.email,
            passwordHash,
            provider: 'local',
            isVerified: false,
            role: 'USER',
            status: 'ACTIVE'
        });
        await user.save();
        // Create user profile
        const profile = new profile_model_js_1.Profile({
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
    static async login(credentials) {
        // Find user
        const user = await user_model_js_1.User.findOne({ email: credentials.email });
        if (!user || user.provider !== 'local' || !user.passwordHash) {
            throw new error_js_1.AppError('Invalid email or password', 400);
        }
        // Validate password
        const isMatch = await bcryptjs_1.default.compare(credentials.passwordHash, user.passwordHash);
        if (!isMatch) {
            throw new error_js_1.AppError('Invalid email or password', 400);
        }
        // Check account status
        if (user.status !== 'ACTIVE') {
            throw new error_js_1.AppError(`Account is ${user.status.toLowerCase()}`, 403);
        }
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Get user profile
        const profile = await profile_model_js_1.Profile.findOne({ userId: user._id });
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
    static async refresh(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, index_js_1.config.jwtSecret);
            const user = await user_model_js_1.User.findById(decoded.id);
            if (!user) {
                throw new error_js_1.AppError('User not found', 404);
            }
            if (user.status !== 'ACTIVE') {
                throw new error_js_1.AppError(`Account is ${user.status.toLowerCase()}`, 403);
            }
            // Generate new tokens
            return this.generateTokens({ id: user._id.toString(), role: user.role });
        }
        catch (error) {
            throw new error_js_1.AppError('Invalid or expired refresh token', 401);
        }
    }
    /**
     * Fetch current user and profile context
     */
    static async getMe(userId) {
        const user = await user_model_js_1.User.findById(userId).select('-passwordHash');
        if (!user) {
            throw new error_js_1.AppError('User not found', 404);
        }
        const profile = await profile_model_js_1.Profile.findOne({ userId: user._id });
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
exports.AuthService = AuthService;
