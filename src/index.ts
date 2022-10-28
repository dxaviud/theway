import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Wanderer } from "./entity/Wanderer";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new wanderer into the database...");
    const wanderer = new Wanderer();
    wanderer.email = "TypeScript@gmail.com";
    wanderer.firstName = "Timber";
    wanderer.lastName = "Saw";
    wanderer.age = 25;
    const wandererRepository = AppDataSource.getRepository(Wanderer);
    await wandererRepository.save(wanderer);
    console.log("Saved a new wanderer with id: " + wanderer.id);

    console.log("Loading wanderer from the database...");
    const wanderers = await wandererRepository.find();
    console.log("Loaded wanderers: ", wanderers);

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
