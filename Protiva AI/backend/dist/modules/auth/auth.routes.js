"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_validation_js_1 = require("./auth.validation.js");
const validate_js_1 = require("../../middleware/validate.js");
const auth_js_1 = require("../../middleware/auth.js");
const router = (0, express_1.Router)();
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required')
});
router.post('/register', (0, validate_js_1.validate)(auth_validation_js_1.registerSchema), auth_controller_js_1.AuthController.register);
router.post('/login', (0, validate_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.AuthController.login);
router.post('/refresh', (0, validate_js_1.validate)(refreshSchema), auth_controller_js_1.AuthController.refresh);
router.post('/logout', auth_controller_js_1.AuthController.logout);
router.get('/me', auth_js_1.authenticate, auth_controller_js_1.AuthController.getMe);
exports.default = router;
