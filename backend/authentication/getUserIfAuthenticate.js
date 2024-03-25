const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { privateKey } = require("../privateKey");

const getUserIfAuthenticate = async (token, res) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, privateKey);
    // decodedToken: {
    //   userId: '65e08b9b240cdd0c6532a78c',
    //   email: 'f5@gmail.com',
    //   iat: 1709215028,
    //   exp: 1709218628
    // }
  } catch (error) {
    console.log(error);
    res.json({ message: "Invalid token, please try again" });
    return undefined;
  }

  const user = await User.findOne({ email: decodedToken.email });

  return user;
};

module.exports = getUserIfAuthenticate;
