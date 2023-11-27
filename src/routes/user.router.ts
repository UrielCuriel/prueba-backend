import type { Express } from "express";
import express from "express";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { User } from "../models";
import { isAuth } from "../middlewares/auth";

export class UserRouter {
  router: any;
  constructor(private app: Express, private userService?: UserService) {
    this.userService = this.userService ?? new UserService();
    this.router = express.Router();
    this.app.use("/users", this.router);
    this.router.get("/", this.getUsers.bind(this));
    this.router.post("/", this.createUser.bind(this));
    this.router.post("/find", this.find.bind(this));
    this.router.put("/:id", isAuth, this.update.bind(this));
    this.router.delete("/:id", isAuth, this.delete.bind(this));
  }

  async getUsers(req: any, res: any) {
    try {
      //TODO: validate query params like limit, offset, etc
      //TODO: add pagination
      const users = await this.userService?.findAll(req.query);
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async createUser(req: any, res: any, next: any) {
    try {
      const user = new User(req.body);
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).json({ error: errors });
        return next();
      }
      const result = await this.userService?.create(user);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === "User already exists") {
        res.status(400).json({ error: error.message });
        return next();
      }
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async find(req: any, res: any) {
    try {
      const user = await this.userService?.findOne(req.body);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async update(req: any, res: any) {
    try {
      //only allow user to update their own profile
      if (req.session["user"].id !== parseInt(req.params.id)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const user = await this.userService?.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  async delete(req: any, res: any) {
    try {
      //only allow user to delete their own profile
      if (req.session["user"].id !== parseInt(req.params.id)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const user = await this.userService?.delete(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
