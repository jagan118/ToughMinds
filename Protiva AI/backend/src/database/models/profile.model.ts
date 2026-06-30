import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export interface IPreferences {
  darkMode?: boolean;
  language?: string;
  notificationsEnabled?: boolean;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  photo?: string;
  phone?: string;
  country?: string;
  city?: string;
  languages: string[];
  profession?: string;
  headline?: string;
  bio?: string;
  socialLinks: ISocialLinks;
  preferences: IPreferences;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    photo: {
      type: String
    },
    phone: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    languages: {
      type: [String],
      default: []
    },
    profession: {
      type: String,
      trim: true
    },
    headline: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    socialLinks: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      portfolio: { type: String, trim: true }
    },
    preferences: {
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: 'en' },
      notificationsEnabled: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
