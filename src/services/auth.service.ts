import { Repository } from "typeorm";
import { AppDataSource, User } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtConfig } from "../utils/config";
export class AuthService {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...data } = user;
      const token = this.generateToken(data as User);
      return { token };
    }
    throw new Error("Invalid email or password");
  }

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, user }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }

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
