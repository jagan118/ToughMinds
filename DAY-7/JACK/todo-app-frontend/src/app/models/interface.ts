// src/app/models/interfaces.ts

export interface User {
  _id: string;
  email: string;
  name: string;
  token?: string;
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  dueDate?: Date;
  category?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}