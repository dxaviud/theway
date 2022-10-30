import { Request, Response } from "express";
import { EntityManager } from "typeorm";

export interface AppContext {
  entityManager: EntityManager;
  req?: Request & { session: { wandererId?: number } };
  res?: Response;
}

declare global {
  namespace Express {
    interface Request {
      context: AppContext;
    }
  }
}
