import { DataSource } from "typeorm";
import { PROD } from "./constants";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { migration1670186183521 } from "./migration/1670186183521-migration";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "theway",
  synchronize: !PROD,
  logging: !PROD,
  entities: [User, Post],
  migrations: [migration1670186183521],
  subscribers: [],
});
