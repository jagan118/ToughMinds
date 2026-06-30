export interface IUserProfile {
  fullName: string;
  photo?: string;
  phone?: string;
  country?: string;
  city?: string;
  languages: string[];
  profession?: string;
  headline?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  preferences?: {
    darkMode?: boolean;
    language?: string;
    notificationsEnabled?: boolean;
  };
}

export interface IUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  provider: 'local' | 'google' | 'github' | 'linkedin';
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin?: string;
  profile: IUserProfile | null;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
      fullName: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}
