import request from "supertest";
import express from "express";
import { json } from "body-parser";

import { UserRouter } from "./user.router"; // Ajusta la ruta según corresponda
import { UserService } from "../services/user.service";
import sinon from "sinon";
import { faker } from "@faker-js/faker";

describe("UserRouter", () => {
  let app: express.Express;
  let userServiceStub: sinon.SinonStubbedInstance<UserService>;

  beforeEach(() => {
    app = express();
    app.use(json());
    userServiceStub = sinon.createStubInstance(UserService);
    new UserRouter(app, userServiceStub);
  });

  afterEach(() => {
    sinon.restore(); // Restaurar los mocks después de cada prueba
  });

  it("GET /users should return all users", async () => {
    const userData = {
      id: 1,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
    };
    userServiceStub.findAll.resolves([userData]);

    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([userData]);
    sinon.assert.calledOnce(userServiceStub.findAll);
  });

  it("POST /users should create a new user", async () => {
    const userData = {
      id: 1,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
    };
    userServiceStub.create.resolves(userData);

    const response = await request(app)
      .post("/users")
      .set("Content-type", "application/json")
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(userData);
    sinon.assert.calledOnce(userServiceStub.create);
  });
});
