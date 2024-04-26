import { User } from "../models/user.model.js";
import { errorHanddler } from "../utils/error.Handdler.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";


//Here !!  User Create
export const userCreate = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const IsExist = await User.findOne({ email });
    if (IsExist) return next(errorHanddler(400, "User already existed"));

    const hashPass = bcryptjs.hashSync(password, 10);

    await User.create({ name, email, password: hashPass });

    res.status(202).json({ message: "User successfully created" });
  } catch (error) {
    next(error);
  }
};

//User Login

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const IsExist = await User.findOne({ email });

    if (!IsExist) return next(errorHanddler(404, "User not found"));

    const MatchPass = bcryptjs.compareSync(password, IsExist.password);

    if (!MatchPass) return next(errorHanddler(400, "Incorrect password"));

    const token = jwt.sign({ _id: IsExist._id }, process.env.SECRET_KEY);

    res
      .cookie("cookie", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, msg: "User successfully login" });
  } catch (error) {
    next(error);
  }
};

// User Profile
export const userProfile = async (req, res, next) => {
  const { user } = req;

  const { password, ...rest } = user._doc;

  res.status(200).json(rest);
};

//User Logout

export const UserLogout = async (req, res, next) => {
  res
    .clearCookie("cookie")
    .status(200)
    .json({ message: "User successfully logout" });
};

//User Update

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHanddler(400, "You can update only your accout"));
  try {
    if (req.body.email) {
      const IsExist = await User.findOne({ email: req.body.email });

      if (IsExist) return next(errorHanddler(400, "Email already existed"));
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//User Delete
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res
    .clearCookie("cookie")
    .status(200)
    .json({ message: "User successfully deleted" });
};
