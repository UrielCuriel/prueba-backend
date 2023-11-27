import { AuthService } from "../services/auth.service";
import express from "express";
/**
 * Represents the AuthRouter class responsible for handling authentication routes.
 */
export class AuthRouter {
  private router: express.Router;

  /**
   * Creates an instance of AuthRouter.
   * @param app - The Express application.
   * @param authService - The instance of the AuthService class.
   */
  constructor(private app: express.Express, private authService: AuthService = new AuthService()) {
    this.router = express.Router();
    this.app.use("/auth", this.router);
    this.router.post("/login", this.login.bind(this));
  }

  /**
   * Handles the login route.
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  private async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService?.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
