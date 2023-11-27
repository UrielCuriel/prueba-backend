import type { Express } from "express";
import express from "express";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { User } from "../models";
import { isAuth } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
export class UserRouter {
  router: any;

  /**
   * Constructs a new instance of the UserRouter class.
   * @param app - The Express application.
   * @param userService - An optional instance of the UserService class.
   */
  constructor(private app: Express, private userService?: UserService) {
    this.userService = this.userService ?? new UserService();
    this.router = express.Router();
    this.app.use("/users", this.router);
    this.router.get("/", this.getUsers.bind(this));
    this.router.post("/", this.createUser.bind(this));
    this.router.get("/find", this.find.bind(this));
    this.router.put("/:id", isAuth, this.update.bind(this));
    this.router.delete("/:id", isAuth, this.delete.bind(this));
  }

  /**
   * Retrieves a list of users.
   * @param req - The request object.
   * @param res - The response object.
   * @swagger
   * /users:
   *   get:
   *     summary: Retrieves a list of users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  async getUsers(req: any, res: any) {
    try {
      //TODO: validate query params like limit, offset, etc
      //TODO: add pagination
      const users = await this.userService?.findAll(req.query);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  /**
   * Creates a new user.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next middleware function.
   * @swagger
   * /users:
   *   post:
   *     summary: Creates a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The created user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async createUser(req: any, res: any, next: any) {
    try {
      const { id, createdAt, updatedAt, comments, posts, ...data } = req.body;
      const user = new User(data);
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).json({ error: errors });
        return next();
      }
      const result = await this.userService?.create(user);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "User already exists") {
        res.status(400).json({ error: error.message });
        return next();
      }
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  /**
   * Finds a user.
   * @param req - The request object.
   * @param res - The response object.
   * @swagger
   * /users/find:
   *   get:
   *     summary: Finds a user
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: The found user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async find(req: any, res: any) {
    try {
      const user = await this.userService?.findOne(req.query);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  /**
   * Updates a user.
   * @param req - The request object.
   * @param res - The response object.
   * @swagger
   * /users/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Updates a user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: The updated user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async update(req: any, res: any) {
    try {
      //only allow user to update their own profile
      if (req.session["user"].id !== parseInt(req.params.id)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const user = await this.userService?.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  /**
   * Deletes a user.
   * @param req - The request object.
   * @param res - The response object.
   * @swagger
   * /users/{id}:
   *   delete:
   *     security:
   *       - bearerAuth: []
   *     summary: Deletes a user
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The user ID
   *     responses:
   *       200:
   *         description: The deleted user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  async delete(req: any, res: any) {
    try {
      //only allow user to delete their own profile
      if (req.session["user"].id !== parseInt(req.params.id)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const user = await this.userService?.delete(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
