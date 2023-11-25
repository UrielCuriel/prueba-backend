import { Repository } from "typeorm";
import { AppDataSource } from "../models";
import { UserService } from "./user.service";
import { faker } from "@faker-js/faker";
import sinon from "sinon";

describe("UserService", () => {
  let service: UserService;
  let userRepository: any;
  beforeEach(async () => {
    userRepository = sinon.createStubInstance(Repository);
    sinon.stub(AppDataSource, "getRepository").returns(userRepository);
    service = new UserService();
  });

  afterEach(() => {
    sinon.restore(); // Restaurar los mocks después de cada prueba
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };

      userRepository.create.returns(userData);
      userRepository.save.returns(userData);

      const result = await service.create(userData);
      expect(result).toEqual(userData);
      sinon.assert.calledWith(userRepository.create, userData);
      sinon.assert.calledWith(userRepository.save, userData);
    });
    it("should return a user without password", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      userRepository.create.returns(userData);
      userRepository.save.returns(userData);

      const result = await service.create(userData);
      expect(result).not.toHaveProperty("password");
      sinon.assert.calledWith(userRepository.create, userData);
      sinon.assert.calledWith(userRepository.save, userData);
    });
    it("should throw an error if user already exists", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      userRepository.create.returns(userData);
      userRepository.save.throws({ code: "ER_DUP_ENTRY" });

      await expect(service.create(userData)).rejects.toThrow(
        "User already exists"
      );
      sinon.assert.calledWith(userRepository.create, userData);
      sinon.assert.calledWith(userRepository.save, userData);
    });
  });

  describe("findOne", () => {
    it("should find a user", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      userRepository.findOne.returns(userData);

      const result = await service.findOne({
        where: {
          username: userData.username,
          password: userData.password,
        },
      });
      expect(result).toEqual(userData);
      sinon.assert.calledWith(userRepository.findOne, {
        where: {
          username: userData.username,
          password: userData.password,
        },
      });
    });
    it("should throw an error if user does not exist", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      userRepository.findOne.returns(undefined);

      await expect(
        service.findOne({
          where: {
            username: userData.username,
            password: userData.password,
          },
        })
      ).rejects.toThrow("User not found");
      sinon.assert.calledWith(userRepository.findOne, {
        where: {
          username: userData.username,
          password: userData.password,
        },
      });
    });
  });

  describe("findAll", () => {
    it("should find all users", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };

      userRepository.find.returns([userData]);

      const result = await service.findAll();
      expect(result).toEqual([userData]);
      sinon.assert.calledWith(userRepository.find);
    });
    it("should filter users by username", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };

      userRepository.find.returns([userData]);

      const result = await service.findAll({
        where: {
          username: userData.username,
        },
      });
      expect(result).toEqual([userData]);
      sinon.assert.calledWith(userRepository.find, {
        where: {
          username: userData.username,
        },
      });
    });
    it("should filter users by email", async () => {
      const userData = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      };

      userRepository.find.returns([userData]);

      const result = await service.findAll({
        where: {
          email: userData.email,
        },
      });
      expect(result).toEqual([userData]);
      sinon.assert.calledWith(userRepository.find, {
        where: {
          email: userData.email,
        },
      });
    });
  });
});
