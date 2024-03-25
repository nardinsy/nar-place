function id2ppicFS(id) {}

function id2ppicDB(id) {}
exports.module = { id2ppicFS, id2ppicFS };

// api.js
const { id2ppicFS, id2ppicDB } = require("../helper/idToPpic");

app.use((req, res, next) => {
  configurePPicDependencies(req.deps, false);
  next();
});

function configurePPicDependencies(deps, useFS) {
  if (useFS) {
    deps.f = id2ppicFS;
  } else {
    deps.f = id2ppicDB;
  }
}

const getUserProfilePicture = (user, req, res, next) => {
  res.send(req.deps.f(user.id));
};

// test.js
const { id2ppicFS, id2ppicDB } = require("../helper/idToPpic");

function getUserProfilePictureTest() {
  const user = { id: 25 };
  let capturedData = null;

  const f = (id) => {
    return id.toBArray();
  };

  const res = {
    send: (data) => {
      capturedData = data;
    },
  };
  getUserProfilePicture(user, { deps: { f } }, res, {});

  expect(capturedData).toBe(f(25));
}
