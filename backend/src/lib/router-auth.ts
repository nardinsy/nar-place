import { Router } from "express";
import { AuthEndpoints } from "./auth";
import { createAuthEndpoints } from "./auth";

type AuthRouter = Router & AuthEndpoints;

function routerAuth() {
  const router = Router();
  return Object.assign(router, createAuthEndpoints(router)) as AuthRouter;
  // return { ...router, ...createAuthEndpoints(router) } as AuthRouter;
}

export default routerAuth;
