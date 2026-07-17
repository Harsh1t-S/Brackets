"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const errorHandler = (error, req, res, next) => {
    console.error(error);
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: error.flatten().fieldErrors,
        });
        return;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2002":
                res.status(409).json({
                    success: false,
                    message: "A unique field already exists.",
                });
                return;
            case "P2025":
                res.status(404).json({
                    success: false,
                    message: "Record not found.",
                });
                return;
        }
    }
    if (error instanceof Error) {
        switch (error.message) {
            case "SLUG_ALREADY_EXISTS":
                res.status(409).json({
                    success: false,
                    message: "A problem with this slug already exists.",
                });
                return;
        }
    }
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
