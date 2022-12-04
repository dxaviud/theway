import { MiddlewareFn } from "type-graphql";
import { AppContext } from "../types";

export const isAuthenticated: MiddlewareFn<AppContext> = (
  { context: { req } },
  next
) => {
  if (!req) {
    throw new Error("request missing");
  }
  if (!req.session.userId) {
    throw new Error("not authenticated");
  }
  return next();
};
