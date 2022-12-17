import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
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
  if (PROD) {
    await AppDataSource.runMigrations({
      transaction: "all",
    });
  }

  const app = express();

  const redis = new Redis(process.env.REDIS_URL);
  redis.on("error", console.error);
  const RedisStore = connectRedis(session);
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
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
        // domain: PROD ? '.the-way.dev' : undefined,
      },
      secret: process.env.SESSION_SECRET,
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
        // emitSchemaFile: {
        //   path: "src/schema.gql",
        //   commentDescriptions: true,
        //   sortedSchema: false,
        // },
      }),
      graphiql: true,
      context,
    })
  );
  app.get("/", (_, res) => {
    res.send("Hello World");
  });
  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Express server listening on localhost:${process.env.PORT}`);
  });
})();
