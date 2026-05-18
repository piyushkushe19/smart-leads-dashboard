import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: Omit<IUserDocument, 'password'>;
  token: string;
}

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: input.role ?? UserRole.SALES,
  });

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

export const getUserById = async (id: string): Promise<IUserDocument> => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
