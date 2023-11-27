import Sinon from "sinon";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { AppDataSource, User } from "../models";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: any;
  let where: any;
  let addSelect: any;
  let createQueryBuilder: any;

  beforeEach(() => {
    where = Sinon.stub().callsArg(0);
    addSelect = Sinon.stub();
    addSelect.withArgs("user.password").returns({ where });
    createQueryBuilder = Sinon.stub().callsArg(0);
    createQueryBuilder.withArgs("user").returns({ addSelect });
    userRepository = Sinon.createStubInstance<Repository<User>>(Repository);
    userRepository.createQueryBuilder = createQueryBuilder;
    Sinon.stub(AppDataSource, "getRepository")
      .withArgs(User)
      .returns(userRepository);

    authService = new AuthService();
  });

  afterEach(() => {
    Sinon.restore();
  });

  describe("login", () => {
    it("should return a token when the user exists and the password is correct", async () => {
      const userData = {
        id: faker.number.int({ min: 1, max: 100 }),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = new User(userData);
      await user.hashPassword();

      const getOne = Sinon.stub().resolves(user);

      where
        .withArgs("user.email = :email", { email: user.email })
        .returns({ getOne });

      const result = await authService.login(user.email, userData.password);

      expect(result).toHaveProperty("token");
    });

    it("should throw an error when the user does not exist", async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const getOne = Sinon.stub().resolves(undefined);

      where
        .withArgs("user.email = :email", { email: email })
        .returns({ getOne });

      await expect(authService.login(email, password)).rejects.toThrowError(
        "Invalid email or password"
      );
    });

    it("should throw an error when the password is incorrect", async () => {
      const userData = {
        id: faker.number.int(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = new User(userData);
      await user.hashPassword();

      const incorrectPassword = faker.internet.password();

      const getOne = Sinon.stub().resolves(user);

      where
        .withArgs("user.email = :email", { email: user.email })
        .returns({ getOne });

      await expect(
        authService.login(user.email, incorrectPassword)
      ).rejects.toThrowError("Invalid email or password");
    });
  });

  describe("validateUser", () => {
    it("should return the user when the token is valid", async () => {
      const userData = {
        id: faker.number.int(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = new User(userData);
      await user.hashPassword();

      const getOne = Sinon.stub().resolves(user);

      where
        .withArgs("user.email = :email", { email: user.email })
        .returns({ getOne });

      userRepository.findOneBy.withArgs({ id: user.id }).resolves(user);

      Sinon.stub(jwt, "verify").returns({ id: user.id } as any); // Add 'as any' to fix the type error

      const { token } = await authService.login(user.email, userData.password);

      const result = await authService.validateUser(token);

      expect(result).toEqual(user);
    });

    it("should throw an error when the token is invalid", async () => {
      const token = "invalid_token";

      Sinon.stub(jwt, "verify").returns(null as any);

      await expect(authService.validateUser(token)).rejects.toThrowError(
        "Invalid token"
      );
    });

    it("should throw an error when the user is not found", async () => {
      const userData = {
        id: faker.number.int(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = new User(userData);
      user.hashPassword();

      const token = "valid_token";

      userRepository.findOneBy.withArgs({ id: user.id }).resolves(undefined);

      Sinon.stub(jwt, "verify").returns({ id: user.id } as any);

      await expect(authService.validateUser(token)).rejects.toThrowError(
        "User not found"
      );
    });
  });
});
