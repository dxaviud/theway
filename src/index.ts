import connectRedis from "connect-redis";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import { createClient } from "redis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { PROD } from "./constants";
import { wanderer } from "./controller/wanderer";
import { AppDataSource } from "./data-source";
import { HelloResolver } from "./resolver/hello";
import { WandererResolver } from "./resolver/wanderer";
import { AppContext } from "./types";

(async () => {
  await AppDataSource.initialize();
  // const wandererRepository = AppDataSource.getRepository(Wanderer);
  // await wandererRepository.clear();
  // console.log("Inserting a new wanderer into the database...");
  // const wanderer = new Wanderer();
  // wanderer.email = "TypeScript@gmail.com";
  // wanderer.firstName = "Timber";
  // wanderer.lastName = "Saw";
  // wanderer.age = 25;
  // await wandererRepository.save(wanderer);
  // console.log("Saved a new wanderer with id: " + wanderer.id);

  const app = express();

  // redis@v4
  const redisClient = createClient({ legacyMode: true });
  redisClient.on("error", console.error);
  await redisClient.connect();
  const RedisStore = connectRedis(session);
  app.use(
    session({
      name: "wayid",
      store: new RedisStore({
        client: redisClient as any,
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
  };
  app.use((req, res, next) => {
    context.req = req;
    context.res = res;
    req.context = context;
    next();
  });
  app.use("/wanderer", wanderer);
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: await buildSchema({
        resolvers: [HelloResolver, WandererResolver],
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
