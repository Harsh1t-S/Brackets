import { Request, Response } from "express";
import adminDashboardService from "./adminDashboard.service";

class AdminDashboardController {
  async getDashboardStats(
    req: Request,
    res: Response
  ) {
    try {
      const stats =
        await adminDashboardService.getDashboardStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics.",
      });
    }
  }
}

export default new AdminDashboardController();