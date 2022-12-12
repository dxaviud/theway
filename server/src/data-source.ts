import { DataSource } from "typeorm";
import { PROD } from "./constants";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Vote } from "./entity/Vote";
import { Initialize } from "./migration/Initialize";

export const AppDataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  url: process.env.DATABASE_URL,
  synchronize: !PROD,
  logging: !PROD,
  entities: [User, Post, Vote],
  migrations: [Initialize],
  subscribers: [],
});
