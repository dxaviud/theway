import { EntityManager } from "typeorm";

export interface AppContext {
  entityManager: EntityManager;
}

declare global {
  namespace Express {
    interface Request {
      context: AppContext;
    }
  }
}
