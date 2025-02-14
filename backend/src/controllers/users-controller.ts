import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "../models/createHttpError";
import User, { IUser } from "../models/user";
import privateKey from "../privateKey";
import { UserDto } from "../shared/dtos";
import { AuthRequestHandler } from "../lib/auth";
import contentTypeBufferSplit from "../helpers/data-url";
import ProfilePicture, { IProfilePicture } from "../models/profile-picture";
import { LoginResult } from "../shared/results";

const getProfilePicturePath = (id: string): string => {
  return `~users/profile-picture/${id}`;
};

export const getProfilePictureUrl = async (id: string): Promise<string> => {
  const profilePictureId: string = id;

  let profilePictureUrl = "";
  let profilePicture: IProfilePicture | null;
  try {
    profilePicture = await ProfilePicture.findOne({
      _id: profilePictureId,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Can not find profile picture with givern id");
  }

  if (!profilePicture) {
    console.log("Can not find place picture");
  } else if (profilePicture.image.kind === "File") {
    profilePictureUrl = getProfilePicturePath(id);
  } else if (profilePicture.image.kind === "Url") {
    profilePictureUrl = profilePicture.image.path;
  }

  return profilePictureUrl;
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  const result = await User.find().exec();

  const usersInfo = await Promise.all(
    result.map(async (user) => {
      return new UserDto(
        user.id,
        user.username,
        user.picture
          ? await getProfilePictureUrl(user.picture.toHexString())
          : undefined,
        user.places.length
      );
    })
  );

  res.json({ usersInfo });
};

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your sign up information.",
      422
    );
    return next(error);
  }

  const username: string = req.body.username;
  const email: string = req.body.email;
  const password: string = req.body.password;

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

  let hashedPassword: string;
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

  const token = await generateToken(newUser);

  try {
    await newUser.save();
    // await session.save();
  } catch (error) {
    return next(createHttpError("Signing up failed, please try again.", 500));
    // console.log(error);
  }

  const userDto = new UserDto(newUser.id, username, undefined, 0);
  //   message: "Signup user successfully.",
  //   token: token,
  //   userInfo,
  // });

  res.status(200).json(new LoginResult(token, userDto));
};

export const login: RequestHandler = async (req, res, next) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  let existingUser: IUser | null;

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

  const token = await generateToken(existingUser);

  // const oldNotifications = await getOldNotifications(
  //   existingUser.oldNotifications
  // );

  const userDto = new UserDto(
    existingUser.id,
    existingUser.username,
    existingUser.picture
      ? await getProfilePictureUrl(existingUser.picture.toHexString())
      : undefined,
    existingUser.places.length
  );

  res.status(200).json(new LoginResult(token, userDto));
};

export const logout: AuthRequestHandler = async (user, req, res, next) => {
  res.status(200).json({});
};

export const editUserInfo: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const username: string = req.body.username;

  if (username !== "") {
    user.username = username;
  } else {
    return;
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

export const changeProfilePicture: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const image: string = req.body.image;

  const deleteOk = await deleteUserPictureFromDB(user.id);

  if (!image && deleteOk) {
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

  const { contentType, buffer } = contentTypeBufferSplit(image);

  // let userPicture;

  const userPicture: IProfilePicture = new ProfilePicture({
    image: {
      kind: "File",
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

  user.picture = userPicture._id;

  try {
    user.save();
  } catch (error) {
    console.log(error);
  }

  const userInfo = new UserDto(
    user.id,
    user.username,
    getProfilePicturePath(userPicture.id)
  );

  res.status(201).json({
    userInfo,
  });
};

export const changeProfilePictureWithUrl: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const image: string = req.body.image;
  const deleteOk = await deleteUserPictureFromDB(user.id);

  if (!image && deleteOk) {
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

  const userPicture: IProfilePicture = new ProfilePicture({
    image: {
      kind: "Url",
      path: image,
    },
    userId: user.id,
  });

  try {
    await userPicture.save();
  } catch (error) {
    console.log(error);
  }

  user.picture = userPicture._id;

  try {
    user.save();
  } catch (error) {
    console.log(error);
  }

  const userInfo = new UserDto(user.id, user.username, image);

  res.status(201).json({
    userInfo,
  });
};

export const getUserProfilePicture: RequestHandler = async (req, res, next) => {
  const userId: string = req.params.uid;

  let userPicture;
  try {
    userPicture = await ProfilePicture.findOne({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }

  if (!userPicture) {
    res.status(404).end();
  } else if (userPicture.image.kind === "File") {
    res.set("Content-Type", userPicture.image.contentType);
    res.send(userPicture.image.data);
  }
};

export const changePassword: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const password: string = req.body.password;

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createHttpError("Could not change password, please try again.", 500)
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

  res.status(200).json({});
};

export const changeUsername: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const username: string = req.body.username;

  user.username = username;

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError("Could not change username, please try again.", 500)
    );
  }

  res.status(200).json({});
};

const generateToken = async (user: IUser): Promise<string> => {
  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, privateKey);
  } catch (error) {
    console.log(error);
    throw new Error("Can not generate token");
  }

  return token;
};

const deleteUserPictureFromDB = async (id: string) => {
  try {
    const userPicture = await ProfilePicture.findOne({
      userId: id,
    });
    //if you want to store all picture do not delete
    if (userPicture) {
      await ProfilePicture.findByIdAndDelete(userPicture._id.toHexString());
      return "Delete";
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
