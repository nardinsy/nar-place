const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Session = require("../models/session");
const Picture = require("../models/profile-picture");

const { createHttpError } = require("../models/createHttpError");
const dataUrl = require("../helpers/data-url");

// const uuid = require("uuid");
const { privateKey } = require("../privateKey");
const { ObjectId } = require("mongodb");

const getProfilePictureUrl = (id) => {
  return `users/profile-picture/${id}`;
};

const getUsers = async (req, res, next) => {
  const result = await User.find().exec();

  const usersInfo = result.map((user) => {
    // console.log(user.picture.toHexString());
    return {
      userId: user.id,
      username: user.username,
      placeCount: user.places.length,
      pictureUrl: user.picture
        ? getProfilePictureUrl(user.picture.toHexString())
        : undefined,
      // pictureUrl: (if has picture) ? url to the picture : undefined
    };
  });

  res.json({ message: "Get users successfully", usersInfo });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your sign up information.",
      422
    );
    return next(error);
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        createHttpError("User exists already, please login instead.", 422)
      );
    }
  } catch (error) {
    return next(
      createHttpError("Signing up failed, please try again later.", 500)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createHttpError("Could not create user, please try again.", 500)
    );
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    places: [],
  });

  // const token = uuid();
  // const session = new Session({ email, token });

  const token = await generateToken(newUser);

  try {
    await newUser.save();
    // await session.save();
  } catch (error) {
    return next(createHttpError("Signing up failed, please try again.", 500));
    // console.log(error);
  }

  res.status(201).json({
    message: "Signup user successfully.",
    token: token,
    userId: newUser.id,
    username,
  });
};

const login = async (req, res, next) => {
  // return await next(
  //   createHttpError("Could not identify user or Wrong password", 401)
  // );
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      createHttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!existingUser) {
    return next(
      createHttpError("Could not identify user or Wrong password", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(createHttpError("Wrong password", 401));
  }

  if (!isValidPassword) {
    return next(
      createHttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  // const token = uuid();
  // const session = new Session({ email, token });

  // try {
  //   await session.save();
  // } catch (error) {
  //   return next(
  //     createHttpError("Logging in failed, please try again later.", 500)
  //   );
  // }

  const token = await generateToken(existingUser);

  res.status(200).json({
    message: "User logged in successfully",
    token,
    userId: existingUser.id,
    username: existingUser.username,
    pictureUrl: existingUser.picture
      ? getProfilePictureUrl(existingUser.picture.toHexString())
      : undefined,
  });
};

const logout = async (user, req, res, next) => {
  res.json({ message: "User logged out successfully" });
};

const generateToken = async (user) => {
  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, privateKey);
  } catch (error) {
    console.log(error);
  }

  return token;
};

const editUserInfo = async (user, req, res, next) => {
  const { username } = req.body;

  if (username !== "") {
    user.username = username;
  }

  try {
    await user.save();
  } catch (error) {
    return next(createHttpError("Signing up failed, please try again.", 500));
  }

  res.status(201).json({
    message: "Edit user info successfully.",
    userId: user.id,
    username: user.username,
  });
};

const changeProfilePicture = async (user, req, res, next) => {
  const { image } = req.body;

  deleteUserPictureFromDB(user.id);

  if (!image) {
    user.picture = null;
    try {
      user.save();
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({
      message: "Delete user image successfully.",
    });
    return;
  }

  const { contentType, buffer } = dataUrl.contentTypeBufferSplit(image);

  // let userPicture;

  const userPicture = new Picture({
    image: {
      data: buffer,
      contentType,
    },
    userId: user.id,
  });

  try {
    await userPicture.save();
  } catch (error) {
    console.log(error);
  }

  user.picture = userPicture;

  try {
    user.save();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    message: "Edit user image successfully.",
    pictureUrl: getProfilePictureUrl(userPicture.id),
  });
};

const getUserProfilePicture = async (req, res, next) => {
  const userId = req.params.uid;

  let userPicture;
  try {
    userPicture = await Picture.findOne({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }

  if (!userPicture) {
    res.status(404).end();
  } else {
    res.set("Content-Type", userPicture.image.contentType);
    res.send(userPicture.image.data);
  }
};

const changePassword = async (user, req, res, next) => {
  const { password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createHttpError("Could not change password,, please try again.", 500)
    );
  }

  user.password = hashedPassword;

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError("Could not change password, please try again.", 500)
    );
  }

  res.status(200).json({ message: "Changed password successfully" });
};

const changeUsername = async (user, req, res, next) => {
  const { username } = req.body;

  user.username = username;

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError("Could not change username, please try again.", 500)
    );
  }

  res.status(200).json({ message: "Changed username successfully" });
};

const deleteUserPictureFromDB = async (id) => {
  try {
    const userPicture = await Picture.findOne({
      userId: id,
    });
    //if you want to store all picture do not delete
    if (userPicture) {
      await Picture.findByIdAndDelete(userPicture._id.toHexString());
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.editUserInfo = editUserInfo;
exports.changeProfilePicture = changeProfilePicture;
exports.getUserProfilePicture = getUserProfilePicture;
exports.changePassword = changePassword;
exports.changeUsername = changeUsername;
