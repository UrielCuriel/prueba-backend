import express from "express";
import request from "supertest";
import {PostService} from "../services/post.service";
import {PostRouter} from "./posts.router";

describe("PostRouter", () => {
  let app: express.Express;
  let postService: PostService;
  let postRouter: PostRouter;

  beforeEach(() => {
    app = express();
    postService = new PostService();
    postRouter = new PostRouter(app, postService);
  });

  describe("getAll", () => {
    it("should return all posts", async () => {
      const posts = [
        {
          id: 1,
          title: "Post 1",
          slug: "post-1",
          content: "Content 1",
        },
        {
          id: 2,
          title: "Post 2",
          slug: "post-2",
          content: "Content 2",
        },
      ];

      jest.spyOn(postService, "getAll").mockResolvedValue(posts);

      const response = await request(app).get("/posts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(posts);
    });
  });

  describe("getOneBySlug", () => {
    it("should return a post by slug", async () => {
      const post = {
        id: 1,
        title: "Post 1",
        slug: "post-1",
        content: "Content 1",
      };

      jest.spyOn(postService, "getOneBySlug").mockResolvedValue(post);

      const response = await request(app).get("/posts/post-1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });

  describe("create", () => {
    it("should create a post", async () => {
      const post = {
        id: 1,
        title: "Post 1",
        slug: "post-1",
        content: "Content 1",
      };

      jest.spyOn(postService, "create").mockResolvedValue(post);

      const response = await request(app).post("/posts").send(post);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });
});
