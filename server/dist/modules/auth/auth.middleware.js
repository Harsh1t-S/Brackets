"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        console.log("Received Token:", token);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                role: true,
            },
        });
        console.log("User From Database:", user);
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("===== AUTH ERROR =====");
        console.error(error);
        console.error("======================");
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.protect = protect;
