import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { env } from '../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
    };

    const { user, token } = await authService.registerUser({ name, email, password, role: role as never });

    res.cookie('token', token, COOKIE_OPTIONS);

    return sendSuccess(res, 'Registration successful', { user, token }, 201);
  }
);

export const login = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string };

    const { user, token } = await authService.loginUser({ email, password });

    res.cookie('token', token, COOKIE_OPTIONS);

    return sendSuccess(res, 'Login successful', { user, token });
  }
);

export const logout = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    res.clearCookie('token', { httpOnly: true, secure: env.isProduction });
    return sendSuccess(res, 'Logged out successfully');
  }
);

export const getProfile = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await authService.getUserById(req.user.id);
    return sendSuccess(res, 'Profile retrieved', { user });
  }
);
