import express from "express";
import { graphqlHTTP } from "express-graphql";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./data-source";
import { HelloResolver } from "./resolver/hello";
import { WandererResolver } from "./resolver/wanderer";
import { ResolverContext } from "./types";

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

  // console.log("Loading wanderer from the database...");
  // const wanderers = await wandererRepository.find();
  // console.log("Loaded wanderers: ", wanderers);

  // console.log(
  //   "Here you can setup and run express / fastify / any other framework."
  // );
  const app = express();
  const context: ResolverContext = {
    entityManager: AppDataSource.manager,
  };
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
    console.log("Express server started listenting on localhost:4000");
  });
})();
