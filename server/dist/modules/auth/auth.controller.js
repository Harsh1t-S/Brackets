"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const registerUser = async (req, res) => {
    try {
        const body = auth_validation_1.registerSchema.parse(req.body);
        const result = await (0, auth_service_1.register)(body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const body = auth_validation_1.loginSchema.parse(req.body);
        const result = await (0, auth_service_1.login)(body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.loginUser = loginUser;
const me = async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    res.status(200).json({
        success: true,
        user: req.user,
    });
};
exports.me = me;
