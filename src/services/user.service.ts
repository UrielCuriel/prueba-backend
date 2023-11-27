import { DeepPartial, Repository, FindOneOptions } from "typeorm";
import { AppDataSource, User } from "../models";

export class UserService {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async create(
    userData: DeepPartial<User>
  ): Promise<DeepPartial<User> | undefined> {
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

  async findOne(
    data: FindOneOptions<User>
  ): Promise<DeepPartial<User> | undefined> {
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

  async update(
    id: number,
    userData: DeepPartial<User>
  ): Promise<DeepPartial<User> | undefined> {
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

  async findAll(
    options?: FindOneOptions<User>
  ): Promise<DeepPartial<User>[] | undefined> {
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
