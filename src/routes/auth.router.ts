import { AuthService } from "../services/auth.service";
import express from "express";
export class AuthRouter {
  private router: express.Router;
  constructor(private app: express.Express, private authService: AuthService) {
    this.router = express.Router();
    this.app.use("/auth", this.router);
    this.router.post("/login", this.login.bind(this));
  }
  private async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
