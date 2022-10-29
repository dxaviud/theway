import { EntityManager } from "typeorm";

export interface ResolverContext {
  entityManager: EntityManager;
}
