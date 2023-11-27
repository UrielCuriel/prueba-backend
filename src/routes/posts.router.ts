import express from "express";
import { PostService } from "../services/post.service";
import { isAuth } from "../middlewares/auth";

/**
 * Represents a router for handling post-related routes.
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
   */
  async create(req: express.Request, res: express.Response) {
    try {
      //only allow authenticated users to create posts
      if (!req.session?.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const post = await this.postService.create(req.body, req.session["user"].id as number);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
