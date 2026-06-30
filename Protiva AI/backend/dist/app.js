"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_js_1 = require("./middleware/error.js");
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const app = (0, express_1.default)();
// Standard middlewares
app.use((0, cors_1.default)({
    origin: ['http://localhost:4200'], // Default Angular dev port
    credentials: true
}));
app.use(express_1.default.json());
// Register API modules
app.use('/api/v1/auth', auth_routes_js_1.default);
// API health endpoint (Phase 0 verification)
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        data: {
            timestamp: new Date(),
            uptime: process.uptime()
        }
    });
});
// Centralized error handler
app.use(error_js_1.errorHandler);
exports.default = app;
