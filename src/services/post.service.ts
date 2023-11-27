import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { AppDataSource, Post, User } from "../models";

/**
 * Service class for managing posts.
 */
export class PostService {
  private postRepository: Repository<Post>;
  userRepository: Repository<User>;

  /**
   * Constructs a new instance of the PostService class.
   */
  constructor() {
    this.postRepository = AppDataSource.getRepository(Post);
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Retrieves all posts.
   * @param options - Optional find options.
   * @returns A promise that resolves to an array of post objects.
   * @throws An error if there was a problem retrieving the posts.
   */
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

  /**
   * Retrieves a post by its slug.
   * @param slug - The slug of the post.
   * @returns A promise that resolves to the post object, or null if not found.
   * @throws An error if there was a problem retrieving the post.
   */
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

  /**
   * Creates a new post.
   * @param post - The post object to create.
   * @param userId - The ID of the user associated with the post.
   * @returns A promise that resolves to the created post object.
   * @throws An error if there was a problem creating the post or if the user was not found.
   */
  async create(post: DeepPartial<Post>, userId: number): Promise<DeepPartial<Post>> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }
      post.user = user;
      const newPost = await this.postRepository.save(post);
      return newPost;
    } catch (error) {
      //TODO:  handle errors
      console.log(error);
      throw new Error("Error creating post");
    }
  }
}
