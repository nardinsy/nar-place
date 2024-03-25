const express = require("express");

const getUserIfAuthenticate = require("../authentication/getUserIfAuthenticate");

const runCallbakIfAuthenticated = async (req, res, next, callback) => {
  const token = req.headers.token;
  const user = await getUserIfAuthenticate(token, res);

  if (user) {
    await callback(user, req, res, next);
  }
};

const expressAuth = () => {
  const app = express();

  app.getAuth = (path, callback) => {
    app.get(path, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  };

  app.postAuth = (path, callback) => {
    app.post(path, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  };

  app.patchAuth = (path, callback) => {
    app.patch(path, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  };

  app.deleteAuth = (path, callback) => {
    app.delete(path, async (req, res, next) => {
      await runCallbakIfAuthenticated(req, res, next, callback);
    });
  };

  return app;
};

module.exports = expressAuth;
