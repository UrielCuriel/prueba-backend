import { Repository } from "typeorm";
import { AppDataSource, User } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtConfig } from "../utils/config";
/**
 * Service responsible for handling authentication-related operations.
 */
export class AuthService {
  private userRepository: Repository<User>;

  /**
   * Constructs a new instance of the AuthService class.
   */
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Logs in a user with the provided email and password.
   * @param email - The email of the user.
   * @param password - The password of the user.
   * @returns A promise that resolves to an object containing the authentication token.
   * @throws An error if the email or password is invalid.
   */
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", { email }).getOne();

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...data } = user;
      const token = this.generateToken(data as User);
      return { token };
    }
    throw new Error("Invalid email or password");
  }

  /**
   * Generates an authentication token for the given user.
   * @param user - The user object.
   * @returns The generated authentication token.
   */
  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, user }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

  /**
   * Validates a user based on the provided authentication token.
   * @param token - The authentication token.
   * @returns A promise that resolves to the validated user.
   * @throws An error if the token is invalid or the user is not found.
   */
  async validateUser(token: string): Promise<User> {
    const decoded = jwt.verify(token, jwtConfig.secret) as { id: string };
    if (!decoded) {
      throw new Error("Invalid token");
    }
    try {
      const user = await this.userRepository.findOneBy({
        id: Number(decoded.id),
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("User not found");
    }
  }
}
