import express from "express";
import { json } from "body-parser";
import helmet from "helmet";
import { AppDataSource } from "./models";
import { UserRouter } from "./routes/user.router";
import {serverConfig} from "./utils/config";

const app = express();

app.use(helmet());
app.use(json());

//middlewares

//routes
new UserRouter(app);

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
