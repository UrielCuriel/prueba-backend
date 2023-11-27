import express from "express";
import { PostService } from "../services/post.service";

export class PostRouter {
  private router: express.Router;
  constructor(
    private app: express.Express,
    private postService = new PostService()
  ) {
    this.app = app;
    this.router = express.Router();
    this.app.use("/posts", this.router);
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:slug", this.getOneBySlug.bind(this));
    this.router.post("/", this.create.bind(this));
  }
  async getAll(req: express.Request, res: express.Response) {
    try {
      const posts = await this.postService.getAll();
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async getOneBySlug(req: express.Request, res: express.Response) {
    try {
      const post = await this.postService.getOneBySlug(req.params.slug);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async create(req: express.Request, res: express.Response) {
    try {
      const post = await this.postService.create(req.body);
      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
