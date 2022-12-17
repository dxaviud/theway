import { DataSource } from "typeorm";
import { PROD } from "./constants";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Vote } from "./entity/Vote";
import { migration1671300692774 } from "./migration/init";

export const AppDataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  url: process.env.DATABASE_URL,
  synchronize: !PROD,
  logging: !PROD,
  entities: [User, Post, Vote],
  migrations: [migration1671300692774],
  subscribers: [],
});
