"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookmarks = exports.toggleBookmark = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const toggleBookmark = async (userId, problemId) => {
    const existing = await prisma_1.default.bookmark.findFirst({
        where: {
            userId,
            problemId,
        },
    });
    if (existing) {
        await prisma_1.default.bookmark.delete({
            where: {
                id: existing.id,
            },
        });
        return { bookmarked: false };
    }
    await prisma_1.default.bookmark.create({
        data: {
            userId,
            problemId,
        },
    });
    return { bookmarked: true };
};
exports.toggleBookmark = toggleBookmark;
const getBookmarks = async (userId) => {
    return prisma_1.default.bookmark.findMany({
        where: {
            userId,
        },
        include: {
            problem: true,
        },
    });
};
exports.getBookmarks = getBookmarks;
