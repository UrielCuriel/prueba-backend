import Sinon from "sinon";
import { Repository } from "typeorm";
import { Post, AppDataSource, User } from "../models";
import { PostService } from "./post.service";
import { faker } from "@faker-js/faker";

describe("PostService", () => {
  let service: PostService;
  let postRepository: any;
  let userRepository: any;

  beforeEach(() => {
    postRepository = Sinon.createStubInstance<Repository<Post>>(Repository);
    userRepository = Sinon.createStubInstance<Repository<User>>(Repository);
    const stubGetRepository = Sinon.stub(AppDataSource, "getRepository");
    stubGetRepository.withArgs(Post).returns(postRepository);
    stubGetRepository.withArgs(User).returns(userRepository);

    service = new PostService();
  });

  afterEach(() => {
    Sinon.restore();
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

      postRepository.find.resolves(posts);

      const result = await service.getAll();
      expect(result).toEqual(posts);
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

      postRepository.findOneBy.resolves(post);

      const result = await service.getOneBySlug(post.slug);
      expect(result).toEqual(post);
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

      const user = {
        id: faker.number.int({ min: 1, max: 100 }),
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };

      const userId = user.id;

      postRepository.save.resolves(post);

      userRepository.findOneBy.resolves(user);

      const result = await service.create(post, userId);
      expect(result).toEqual(post);
    });
  });
});
