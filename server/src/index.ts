import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, PROD } from "./constants";
import { AppDataSource } from "./data-source";
import { HelloResolver } from "./resolver/hello";
import { PostResolver } from "./resolver/post";
import { UserResolver } from "./resolver/user";
import { AppContext } from "./types";

(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations({
    transaction: "all",
  });

  const app = express();

  const redis = new Redis();
  redis.on("error", console.error);
  const RedisStore = connectRedis(session);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // 1 year
        sameSite: "lax",
        httpOnly: true,
        secure: PROD,
      },
      secret: "the way that can be spoken is not the eternal way",
      resave: false,
    })
  );
  const context: AppContext = {
    entityManager: AppDataSource.manager,
    redis,
  };
  app.use((req, res, next) => {
    context.req = req;
    context.res = res;
    next();
  });
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: await buildSchema({
        resolvers: [HelloResolver, UserResolver, PostResolver],
        emitSchemaFile: {
          path: "src/schema.gql",
          commentDescriptions: true,
          sortedSchema: false,
        },
      }),
      graphiql: true,
      context,
    })
  );
  app.get("/", (_, res) => {
    res.send("Hello World");
  });
  app.listen(4000, () => {
    console.log("Express server listening on localhost:4000");
  });
})();
