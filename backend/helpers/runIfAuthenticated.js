const Session = require("../models/session");
const User = require("../models/user");

const runIfAuthenticated = async (token, res, callback) => {
  let session;
  try {
    session = await Session.findOne({ token });
  } catch (error) {
    res.status(503).json({ message: "Try again later please" });
    return;
  }

  if (!session) {
    res.status(401).json({ message: "Token is invalid" });
    return;
  }

  if (session.expired) {
    res.status(401).json({ message: "Token is expired" });
    return;
  }

  const user = await User.findOne({ email: session.email });

  await callback(user);
};

exports.runIfAuthenticated = runIfAuthenticated;
