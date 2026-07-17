"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.toggle = void 0;
const bookmark_service_1 = require("./bookmark.service");
const toggle = async (req, res) => {
    try {
        const { problemId } = req.body;
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const result = await (0, bookmark_service_1.toggleBookmark)(req.user.id, problemId);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.toggle = toggle;
const list = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const bookmarks = await (0, bookmark_service_1.getBookmarks)(req.user.id);
        res.status(200).json({
            success: true,
            data: bookmarks,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.list = list;
