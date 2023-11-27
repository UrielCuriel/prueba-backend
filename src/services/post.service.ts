import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { AppDataSource, Post } from "../models";

export class PostService {
  private postRepository: Repository<Post>;
  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
  }

  async getAll(options?: FindManyOptions<Post>): Promise<DeepPartial<Post>[]> {
    try {
      const post = await this.postRepository.find(options);
      return post;
    } catch (error) {
      //TODO:  handle errors
      console.log(error);
      throw new Error("Error getting posts");
    }
  }

  async getOneBySlug(slug: string): Promise<DeepPartial<Post> | null> {
    try {
      const post = await this.postRepository.findOneBy({ slug });
      return post;
    } catch (error) {
      //TODO:  handle errors
      console.log(error);
      throw new Error("Error getting post");
    }
  }

  async create(post: DeepPartial<Post>): Promise<DeepPartial<Post>> {
    try {
      const newPost = await this.postRepository.save(post);
      return newPost;
    } catch (error) {
      //TODO:  handle errors
      console.log(error);
      throw new Error("Error creating post");
    }
  }
}
