import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";

// TODO: user env variables for connection options
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "db",
  port: 3306,
  username: "user",
  password: "pass",
  database: "test",
  entities: [User, Post, Comment],
  synchronize: true,
  logging: false,
});



