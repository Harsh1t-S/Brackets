import { Request, Response } from "express";
import dashboardService from "./dashboard.service";

export class DashboardController {
  async getDashboard(
    req: Request,
    res: Response
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const dashboard =
        await dashboardService.getDashboard(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        data: dashboard,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard.",
      });
    }
  }
}

export default new DashboardController();