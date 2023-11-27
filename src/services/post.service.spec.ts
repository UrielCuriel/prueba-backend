import Sinon from "sinon";
import { Repository } from "typeorm";
import { Post, AppDataSource } from "../models";
import { PostService } from "./post.service";

describe("PostService", () => {
  let service: PostService;
  let postRepository: any;

  beforeEach(() => {
    postRepository = Sinon.createStubInstance<Repository<Post>>(Repository);
    Sinon.stub(AppDataSource, "getRepository")
      .withArgs(Post)
      .returns(postRepository);

    service = new PostService();
  });

  afterEach(() => {
    Sinon.restore();
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

      postRepository.find.resolves(posts);

      const result = await service.getAll();
      expect(result).toEqual(posts);
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

      postRepository.findOneBy.resolves(post);

      const result = await service.getOneBySlug(post.slug);
      expect(result).toEqual(post);
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

      postRepository.save.resolves(post);

      const result = await service.create(post);
      expect(result).toEqual(post);
    });
  });
});
