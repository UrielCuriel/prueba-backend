import express from "express";
import { PostService } from "../services/post.service";
import { isAuth } from "../middlewares/auth";
import { Post } from "../models";
import { validate } from "class-validator";

/**
 * Represents a router for handling post-related routes.
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */
export class PostRouter {
  private router: express.Router;

  /**
   * Creates an instance of PostRouter.
   * @param app - The Express application.
   * @param postService - The post service.
   */
  constructor(private app: express.Express, private postService: PostService = new PostService()) {
    this.app = app;
    this.router = express.Router();
    this.app.use("/posts", this.router);
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:slug", this.getOneBySlug.bind(this));
    this.router.post("/", isAuth, this.create.bind(this));
  }

  /**
   * Handles the GET request to retrieve all posts.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @swagger
   * /posts:
   *   get:
   *     summary: Retrieves a list of posts
   *     tags: [Posts]
   *     responses:
   *       200:
   *         description: A list of posts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Post'
   */
  async getAll(req: express.Request, res: express.Response) {
    try {
      const posts = await this.postService.getAll();
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Handles the GET request to retrieve a post by its slug.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @swagger
   * /posts/{slug}:
   *   get:
   *     summary: Retrieves a post by its slug
   *     tags: [Posts]
   *     parameters:
   *       - in: path
   *         name: slug
   *         schema:
   *           type: string
   *         required: true
   *         description: The post slug
   *     responses:
   *       200:
   *         description: The post
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   */
  async getOneBySlug(req: express.Request, res: express.Response) {
    try {
      const post = await this.postService.getOneBySlug(req.params.slug);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Handles the POST request to create a new post.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @swagger
   * /posts:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     summary: Creates a new post
   *     tags: [Posts]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Post'
   *     responses:
   *       200:
   *         description: The created post
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Post'
   */
  async create(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      //only allow authenticated users to create posts
      if (!req.session?.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { id, user, createdAt, updatedAt, ...data } = req.body;

      const post = new Post(data);
      const errors = await validate(post);
      if (errors.length > 0) {
        res.status(400).json({ error: errors });
        return next();
      }

      const newPost = await this.postService.create(post, req.session["user"].id as number);
      res.status(200).json(newPost);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
