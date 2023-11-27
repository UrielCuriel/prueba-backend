import express from "express";
import request from "supertest";
import { PostService } from "../services/post.service";
import { faker } from "@faker-js/faker";
import Sinon from "sinon";
import { PostRouter } from "./posts.router";
import { json } from "body-parser";
import session, { MemoryStore } from "express-session";
import { serverConfig } from "../utils/config";

describe("PostRouter", () => {
  let app: express.Express;
  let postService: Sinon.SinonStubbedInstance<PostService>;
  let postRouter: PostRouter;
  beforeEach(() => {
    app = express();
    app.use(json());
    app.use(
      session({
        secret: serverConfig.sessionSecret,
        store: new MemoryStore(),
        resave: false,
        saveUninitialized: false,

        cookie: {
          secure: true,
          //expira la cookie en 1 dia
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );
    app.use((req, res, next) => {
      req.session["user"] = {
        id: faker.number.int({ min: 1, max: 100 }),
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };
      return next();
    });

    postService = Sinon.createStubInstance<PostService>(PostService);
    postRouter = new PostRouter(app, postService as unknown as PostService);
  });

  describe("getAll", () => {
    it("should return all posts", async () => {
      const posts = [
        {
          id: faker.number.int({ min: 1, max: 100 }),
          title: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
          content: faker.lorem.paragraph(),
        },
        {
          id: faker.number.int({ min: 1, max: 100 }),
          title: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
          content: faker.lorem.paragraph(),
        },
      ];

      postService.getAll.resolves(posts);

      const response = await request(app).get("/posts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(posts);
    });
  });

  describe("getOneBySlug", () => {
    it("should return a post by slug", async () => {
      const post = {
        id: faker.number.int({ min: 1, max: 100 }),
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        content: faker.lorem.paragraph(),
      };

      postService.getOneBySlug.resolves(post);

      const response = await request(app).get(`/posts/${post.slug}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });

  describe("create", () => {
    it("should create a post", async () => {
      const post = {
        id: faker.number.int({ min: 1, max: 100 }),
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        content: faker.lorem.paragraph(),
      };

      postService.create.resolves(post);

      const response = await request(app).post("/posts").send(post);

      Sinon.assert.calledOnce(postService.create);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(post);
    });
  });
});
