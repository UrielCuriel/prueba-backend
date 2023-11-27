import { AuthService } from "../services/auth.service";
import express from "express";
/**
 * Represents the AuthRouter class responsible for handling authentication routes.
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
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
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The user's email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 description: The user's password
   *                 example: password123
   *     responses:
   *       200:
   *         description: The logged in user
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: The JWT for the logged in user
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
