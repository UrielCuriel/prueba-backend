import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../utils/config";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session["user"]) {
    return next();
  }
  //validate authorization header
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send({
        error: {
          statusCode: 401,
          name: "UnauthorizedError",
          message: "Missing Authorization Header",
        },
      })
      .end();
  }

  //split authorization header
  const [type, token] = req.headers.authorization.split(" ");
  //validate token type
  if (type !== "Bearer") {
    return res
      .status(401)
      .send({
        error: {
          statusCode: 401,
          name: "UnauthorizedError",
          message: "Missing Authorization Header",
        },
      })
      .end();
  }
  //validate token not empty
  if (!token) {
    return res
      .status(401)
      .send({
        error: {
          statusCode: 401,
          name: "UnauthorizedError",
          message: "Missing Authorization Header",
        },
      })
      .end();
  }

  //validate token
  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    const { user } = payload as any;
    req.session["user"] = user;
    return next();
  } catch (err) {
    return res
      .status(401)
      .send({
        error: {
          statusCode: 401,
          name: "UnauthorizedError",
          message: "Invalid Token",
        },
      })
      .end();
  }
};
