import express from "express";
import { Express } from "express";
import { AuthEndpoints } from "./auth";
import { createAuthEndpoints } from "./auth";

interface AuthExpress extends Express, AuthEndpoints {}

const expressAuth = () => {
  const app = express();
  return Object.assign(app, createAuthEndpoints(app)) as AuthExpress;
};

export default expressAuth;
