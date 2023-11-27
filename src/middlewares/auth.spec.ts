import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/config";
import { isAuth } from "./auth";
import sinon from "sinon";

describe("isAuth", () => {
  let req: Request;
  let res: any;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      session: {},
      headers: {},
    } as Request;
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
      end: sinon.stub().returnsThis(),
    } as any;
    next = jest.fn() as NextFunction;
  });

  it("should call next if user session exists", async () => {
    req.session["user"] = { id: 1 };

    await isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if authorization header is missing", async () => {
    await isAuth(req, res, next);

    sinon.assert.calledWith(res.status, 401);

    sinon.assert.calledWith(res.send, {
      error: {
        statusCode: 401,
        name: "UnauthorizedError",
        message: "Missing Authorization Header",
      },
    });

    sinon.assert.called(res.end);
  });

  it("should return 401 if token type is not Bearer", async () => {
    req.headers = { authorization: "InvalidToken" };

    await isAuth(req, res, next);

    sinon.assert.calledWith(res.status, 401);

    sinon.assert.calledWith(res.send, {
      error: {
        statusCode: 401,
        name: "UnauthorizedError",
        message: "Missing Authorization Header",
      },
    });

    sinon.assert.called(res.end);
  });

  it("should return 401 if token is missing", async () => {
    req.headers = { authorization: "Bearer" };

    await isAuth(req, res, next);
    sinon.assert.calledWith(res.status, 401);

    sinon.assert.calledWith(res.send, {
      error: {
        statusCode: 401,
        name: "UnauthorizedError",
        message: "Missing Authorization Header",
      },
    });

    sinon.assert.called(res.end);
  });

  it("should call next if token is valid", async () => {
    const token = jwt.sign({ user: { id: 1 } }, jwtConfig.secret);
    req.headers = { authorization: `Bearer ${token}` };

    await isAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.session["user"]).toEqual({ id: 1 });
  });

  it("should return 401 if token is invalid", async () => {
    const invalidToken = "invalidToken";
    req.headers = { authorization: `Bearer ${invalidToken}` };

    await isAuth(req, res, next);

    sinon.assert.calledWith(res.status, 401);

    sinon.assert.calledWith(res.send, {
      error: {
        statusCode: 401,
        name: "UnauthorizedError",
        message: "Invalid Token",
      },
    });

    sinon.assert.called(res.end);
  });
});
