import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { Comment } from "./Comment";

import { dbConfig } from "../utils/config";

// TODO: user env variables for connection options
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "db",
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [User, Post, Comment],
  synchronize: true,
  logging: false,
});



