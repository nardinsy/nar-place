const { Router } = require("express");

const getUserIfAuthenticate = require("../authentication/getUserIfAuthenticate");

const runCallbakIfAuthenticated = async (req, res, next, callback) => {
  const token = req.headers.token;
  const user = await getUserIfAuthenticate(token, res);

  if (user) {
    await callback(user, req, res, next);
  }
};

const analyzeRest = (rest) => {
  if (rest.length === 2) {
    return { checkList: rest[0], callback: rest[1] };
  } else {
    return { checkList: undefined, callback: rest[0] };
  }
};

const delegateMethodToRouter = async (path, rest, router, method) => {
  const { checkList, callback } = analyzeRest(rest);

  if (checkList) {
    router[method](path, checkList, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  } else {
    router[method](path, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  }
};

const routerAuth = () => {
  const router = Router();

  router.getAuth = async function (path, ...rest) {
    await delegateMethodToRouter(path, rest, router, "get");
  };

  router.postAuth = async function (path, ...rest) {
    await delegateMethodToRouter(path, rest, router, "post");
  };

  router.patchAuth = async function (path, ...rest) {
    await delegateMethodToRouter(path, rest, router, "patch");
  };

  router.deleteAuth = async function (path, ...rest) {
    await delegateMethodToRouter(path, rest, router, "delete");
  };

  return router;
};

module.exports = routerAuth;
