import { DataSource } from "typeorm";
import { Wanderer } from "./entity/Wanderer";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "theway",
  synchronize: true,
  logging: false,
  entities: [Wanderer],
  migrations: [],
  subscribers: [],
});
