import express from "express";
import { json } from "body-parser";
import helmet from "helmet";
import session, { MemoryStore } from "express-session";
import { AppDataSource, User } from "./models";
import { UserRouter } from "./routes/user.router";
import { serverConfig } from "./utils/config";
import { DeepPartial } from "typeorm";
import {AuthRouter} from "./routes/auth.router";

const app = express();

// middlewares
app.use(helmet());
app.use(json());

//session
declare module "express-session" {
  interface SessionData {
    user: DeepPartial<User>;
  }
}
app.use(
  session({
    secret: serverConfig.sessionSecret,
    store: new MemoryStore(),
    resave: false,
    saveUninitialized: false,

    cookie: {
      secure: true,
      //expira la cookie en 1 dia
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

//routes
new UserRouter(app);
new AuthRouter(app);

//datasource connection
AppDataSource.connect()
  .then(() => {
    console.log("connected to datasource");
    app.listen(serverConfig.port, () => {
      console.log(`listening on port ${serverConfig.port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
