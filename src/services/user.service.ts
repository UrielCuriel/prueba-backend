import { DeepPartial, Repository, FindOneOptions } from "typeorm";
import { AppDataSource, User } from "../models";

/**
 * Service class for managing user-related operations.
 */
export class UserService {
  private userRepository: Repository<User>;

  /**
   * Constructs a new instance of the UserService class.
   */
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Creates a new user with the provided data.
   * @param userData - The data of the user to create.
   * @returns A promise that resolves to the created user.
   * @throws Error if the user already exists or if something goes wrong.
   */
  async create(userData: DeepPartial<User>): Promise<DeepPartial<User> | undefined> {
    try {
      const user = this.userRepository.create(userData);
      const { password, ...result } = await this.userRepository.save(user);
      //remove password from result
      return result;
    } catch (error: any) {
      //if duplicate entry
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("User already exists");
      }
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  /**
   * Finds a user that matches the provided criteria.
   * @param data - The criteria to match against.
   * @returns A promise that resolves to the found user.
   * @throws Error if the user is not found or if something goes wrong.
   */
  async findOne(data: FindOneOptions<User>): Promise<DeepPartial<User> | undefined> {
    try {
      const user = await this.userRepository.findOne(data);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      if ((error as any).message === "User not found") {
        throw new Error("User not found");
      }

      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  /**
   * Updates a user with the provided data.
   * @param id - The ID of the user to update.
   * @param userData - The data to update the user with.
   * @returns A promise that resolves to the updated user.
   * @throws Error if the user is not found or if something goes wrong.
   */
  async update(id: number, userData: DeepPartial<User>): Promise<DeepPartial<User> | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error("User not found");
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...userData,
      });
      return updatedUser;
    } catch (error) {
      if ((error as any).message === "User not found") {
        throw new Error("User not found");
      }
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  /**
   * Deletes a user with the provided ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to the deleted user.
   * @throws Error if the user is not found or if something goes wrong.
   */
  async delete(id: number): Promise<DeepPartial<User> | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error("User not found");
      }
      const deletedUser = await this.userRepository.remove(user);
      return deletedUser;
    } catch (error) {
      if ((error as any).message === "User not found") {
        throw new Error("User not found");
      }
      console.log(error);
      throw new Error("Something went wrong");
    }
  }

  /**
   * Finds all users that match the provided criteria.
   * @param options - The criteria to match against.
   * @returns A promise that resolves to an array of found users.
   * @throws Error if something goes wrong.
   */
  async findAll(options?: FindOneOptions<User>): Promise<DeepPartial<User>[] | undefined> {
    try {
      const users = await this.userRepository.find(options);
      return users;
    } catch (error) {
      //TODO: handle error like property not found
      console.log(error);
      throw new Error("Something went wrong");
    }
  }
}
