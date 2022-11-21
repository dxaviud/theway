import { Request, Response } from "express";
import Redis from "ioredis";
import { EntityManager } from "typeorm";

export interface AppContext {
  entityManager: EntityManager;
  redis: Redis;
  req?: Request & { session: { userId?: number } };
  res?: Response;
}
