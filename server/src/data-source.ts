import { DataSource } from "typeorm";
import { PROD } from "./constants";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Vote } from "./entity/Vote";

export const AppDataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  url: process.env.DATABASE_URL,
  synchronize: !PROD,
  logging: !PROD,
  entities: [User, Post, Vote],
  migrations: [
    /*migration1670186183521*/
  ],
  subscribers: [],
});
