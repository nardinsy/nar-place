import { ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import getUserIfAuthenticated from "../authentication/getUserIfAuthenticated";
import { IUser } from "../models/user";

const runCallbakIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
  callback: AuthRequestHandler
) => {
  const token = req.headers.token;
  const user = await getUserIfAuthenticated(token, res);

  if (typeof user === "object") {
    await callback(user, req, res, next);
  }
};

const delegateMethodToRouter = async (
  entry: EndpointMethods,
  method: ENDPOINTSMETHODSName,
  path: string,
  validationsOrCallback: ValidationChain[] | AuthRequestHandler,
  callbackOrUndefined?: AuthRequestHandler
) => {
  if (
    typeof validationsOrCallback === "object" &&
    typeof callbackOrUndefined === "function"
  ) {
    entry[method](
      path,
      validationsOrCallback,
      async (req: Request, res: Response, next: NextFunction) => {
        await runCallbakIfAuthenticated(req, res, next, callbackOrUndefined);
      }
    );
  } else if (
    typeof validationsOrCallback === "function" &&
    typeof callbackOrUndefined === "undefined"
  ) {
    entry[method](
      path,
      async (req: Request, res: Response, next: NextFunction) => {
        await runCallbakIfAuthenticated(req, res, next, validationsOrCallback);
      }
    );
  }
};

type ENDPOINTSMETHODSName = "get" | "post" | "patch" | "delete";

export type AuthRequestHandler = (
  user: IUser,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export interface AuthEndpoints {
  getAuth(
    path: string,
    validationsOrCallback: ValidationChain[] | AuthRequestHandler,
    callbackOrUndefined?: AuthRequestHandler
  ): any;
  postAuth(
    path: string,
    validationsOrCallback: ValidationChain[] | AuthRequestHandler,
    callbackOrUndefined?: AuthRequestHandler
  ): any;
  patchAuth(
    path: string,
    validationsOrCallback: ValidationChain[] | AuthRequestHandler,
    callbackOrUndefined?: AuthRequestHandler
  ): any;
  deleteAuth(
    path: string,
    validationsOrCallback: ValidationChain[] | AuthRequestHandler,
    callbackOrUndefined?: AuthRequestHandler
  ): any;
}

interface EndpointMethods {
  get(path: string, validationsOrCallback: any, callbackOrUndefined?: any): any;
  post(
    path: string,
    validationsOrCallback: any,
    callbackOrUndefined?: any
  ): any;
  patch(
    path: string,
    validationsOrCallback: any,
    callbackOrUndefined?: any
  ): any;
  delete(
    path: string,
    validationsOrCallback: any,
    callbackOrUndefined?: any
  ): any;
}

export function createAuthEndpoints(entry: EndpointMethods): AuthEndpoints {
  return {
    getAuth: async function (
      path: string,
      validationsOrCallback: ValidationChain[] | AuthRequestHandler,
      callbackOrUndefined?: AuthRequestHandler
    ) {
      await delegateMethodToRouter(
        entry,
        "get",
        path,
        validationsOrCallback,
        callbackOrUndefined
      );
    },

    postAuth: async function (
      path: string,
      validationsOrCallback: ValidationChain[] | AuthRequestHandler,
      callbackOrUndefined?: AuthRequestHandler
    ) {
      await delegateMethodToRouter(
        entry,
        "post",
        path,
        validationsOrCallback,
        callbackOrUndefined
      );
    },

    patchAuth: async function (
      path: string,
      validationsOrCallback: ValidationChain[] | AuthRequestHandler,
      callbackOrUndefined?: AuthRequestHandler
    ) {
      await delegateMethodToRouter(
        entry,
        "patch",
        path,
        validationsOrCallback,
        callbackOrUndefined
      );
    },

    deleteAuth: async function (
      path: string,
      validationsOrCallback: ValidationChain[] | AuthRequestHandler,
      callbackOrUndefined?: AuthRequestHandler
    ) {
      await delegateMethodToRouter(
        entry,
        "delete",
        path,
        validationsOrCallback,
        callbackOrUndefined
      );
    },
  } as AuthEndpoints;
}
