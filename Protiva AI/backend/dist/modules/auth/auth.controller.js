"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_js_1 = require("./auth.service.js");
class AuthController {
    static async register(req, res, next) {
        try {
            const { email, password, fullName } = req.body;
            const result = await auth_service_js_1.AuthService.register({
                email,
                passwordHash: password,
                fullName
            });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_js_1.AuthService.login({
                email,
                passwordHash: password
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await auth_service_js_1.AuthService.refresh(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
                data: tokens
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const userData = await auth_service_js_1.AuthService.getMe(userId);
            res.status(200).json({
                success: true,
                message: 'User details fetched successfully',
                data: userData
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
