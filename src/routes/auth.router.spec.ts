import Sinon from "sinon";
import { AuthService } from "../services/auth.service";
import { AuthRouter } from "./auth.router";
import express from "express";
import { json } from "body-parser";
import { faker } from "@faker-js/faker";
import { User } from "../models";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/config";
import request from "supertest";

describe("authRouter", () => {
  let app: express.Express;
  let authServiceStub: sinon.SinonStubbedInstance<AuthService>;

  beforeEach(() => {
    app = express();
    app.use(json());
    authServiceStub = Sinon.createStubInstance(AuthService);
    new AuthRouter(app, authServiceStub);
  });

  afterEach(() => {
    Sinon.restore(); // Restaurar los mocks después de cada prueba
  });

  it("POST /auth/login should return a token", async () => {
    const userData = {
      id: faker.number.int({ min: 1, max: 100 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = new User(userData);
    await user.hashPassword();

    authServiceStub.login.resolves({
      token: jwt.sign({ id: user.id }, jwtConfig.secret),
    });

    const response = await request(app)
      .post("/auth/login")
      .set("Content-type", "application/json")
      .send({ email: user.email, password: userData.password });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    Sinon.assert.calledOnce(authServiceStub.login);
  });
});
