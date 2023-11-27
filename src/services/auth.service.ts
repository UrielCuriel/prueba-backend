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
      .addSelect("password")
      .where("user.email = :email", { email })
      .getOne();

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = this.generateToken(user);
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
    const user = await this.userRepository.findOneBy({
      id: Number(decoded.id),
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}