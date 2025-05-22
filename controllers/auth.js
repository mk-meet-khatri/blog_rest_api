const { User, File } = require("../models");
const hashPassword = require("../utils/hashPassword");
const comparePassword = require("../utils/comparePassword");
const generateToken = require("../utils/generateToken");
const generateCode = require("../utils/generateCode");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("Email already exists!");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid Credentials");
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      res.code = 401;
      throw new Error("Invalid Credentials!");
    }

    const token = generateToken(user);

    res.status(200).json({
      code: 200,
      status: true,
      message: "User Signin Successfully!",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    if (user.isVerified) {
      res.code = 400;
      throw new Error("User already Verified!");
    }

    const code = generateCode(6);

    user.verificationCode = code;
    await user.save();

    // send email
    await sendEmail({
      emailTo: user.email,
      subject: "Email Verification Code!",
      code,
      content: "Verify your email!",
    });

    res
      .status(200)
      .json({ code: 200, status: true, message: "Code Sent Successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    if (user.verificationCode !== code) {
      res.code = 400;
      throw new Error("Invalid Code!");
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res
      .status(200)
      .json({ code: 200, status: true, message: "User Verifed Successfully!" });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    const code = generateCode(6);
    user.forgotPasswordCode = code;
    await user.save();

    await sendEmail({
      emailTo: user.email,
      subject: "Forgot Password Code",
      code,
      content: "Change your Password!",
    });

    res
      .status(200)
      .json({ code: 200, status: true, message: "Code Sent Successfully!" });
  } catch (error) {
    next(error);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    if (user.forgotPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid Code!");
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgotPasswordCode = null;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password Recovered Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      res.code = 400;
      throw new Error("Old Password doesn't match!");
    }

    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("New Password cannot be same as Old Password!");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Password Changed Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, profilePic } = req.body || {};

    if (!name && !email && !profilePic) {
      res.code = 400;
      throw new Error(
        "At least one field (name or email or profile picture) must be provided!"
      );
    }

    const user = await User.findById(_id).select(
      "-password -verificationCode -forgotPasswordCode"
    );

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    if (email) {
      const isUserExist = await User.findOne({ email });
      if (
        isUserExist &&
        isUserExist.email === email &&
        String(user._id) !== String(isUserExist._id)
      ) {
        res.code = 400;
        throw new Error("Email already exist!");
      }
    }

    if (profilePic) {
      const file = await File.findById(profilePic);
      if (!file) {
        res.code = 404;
        throw new Error("File not found!");
      }
    }

    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.profilePic = profilePic;

    if (email) {
      user.isVerified = false;
    }

    await user.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile Updated Successfully!",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id)
      .select("-password -verificationCode -forgotPasswordCode")
      .populate("profilePic");

    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Get Current User Successfully!",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  verifyCode,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
  currentUser,
};
