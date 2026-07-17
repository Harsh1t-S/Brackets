"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const problem_routes_1 = __importDefault(require("./modules/problem/problem.routes"));
const bookmark_routes_1 = __importDefault(require("./modules/bookmark/bookmark.routes"));
const adminProblem_routes_1 = __importDefault(require("./modules/admin/adminProblem.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/problems", problem_routes_1.default);
app.use("/api/bookmarks", bookmark_routes_1.default);
app.use("/api/admin", adminProblem_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.get("/", (_, res) => {
    res.json({
        message: "CodeForge API Running 🚀",
    });
});
exports.default = app;
