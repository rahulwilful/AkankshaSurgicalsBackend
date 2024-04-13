const { validationResult, matchedData } = require("express-validator");
const User = require("../models/User");
const Role_type = require("../models/Role_Type");
const bcrypt = require("bcryptjs");
const secret = "test";
const logger = require("../config/logger.js");
const jwt = require("jsonwebtoken");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const TestUserAPI = async (req, res) => {
  return res.status(200).send("User API test successfull");
};

//@desc Create User API
//@route POST user/signup
//@access Public
const CreateUser = async (req, res) => {
  const errors = validationResult(req); //checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  //if error return
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/add  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);
  if (data.role_type === "6552fc218c59438ef6c17cd8") {
    logger.error(`${ip}: API /api/v1/user/add  responnded with Error "Only admin can create admin" `);
    return res.status(403).json({ mesasge: "Only admin can create admin" });
  }

  const oldUser = await User.findOne({ email: data.email });

  if (oldUser) {
    logger.error(`${ip}: API /api/v1/user/add  responnded with User already registered! for email: ${data.email} `);
    return res.status(400).json({ message: "User already registered!" });
  }

  const phone = await User.findOne({ mobile_no: data.number });

  if (phone) {
    logger.error(`${ip}: API /api/v1/user/add  responnded with User already registered! for email: ${data.number} `);
    return res.status(406).json({ message: "Number already registered!" });
  }

  const salt = await bcrypt.genSalt(10);
  const securedPass = await bcrypt.hash(data.password, salt);

  await User.create({
    name: data.name,
    email: data.email,
    mobile_no: data.mobile_no,
    password: securedPass,
    role_type: data.role_type || "6611302fe47d0a74ee4ae431",
  })
    .then((user) => {
      logger.info(`${ip}: API /api/v1/user/add  responnded with Success `);
      return res.status(201).json({ result: user });
    })
    .catch((err) => {
      logger.error(`${ip}: API /api/v1/user/add  responnded with Error `);
      return res.status(500).json({ message: err.message });
    });
};

//@desc LogIn User API
//@route GET /api/v1/user/Login
//@access Public
const LogInUser = async (req, res) => {
  const errors = validationResult(req); //checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  //if error return
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/user/login  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      logger.error(`${ip}: API /api/v1/user/login  responded User does not 
      exist with email:  ${email} `);
      return res.status(404).json({ error: "User Does Not Exist" });
    }

    if (!oldUser.approved) {
      logger.error(`${ip}: API /api/v1/user/login  responded User approval is pending for email:  ${email} `);
      return res.status(400).json({ error: "User approval is still pending" });
    }
    /* if (!oldUser.email_varified) {
      logger.error(`${ip}: API /api/v1/user/login  responded please varify email:  ${email} `);
      return res.status(402).json({ error: "Please varify email" });
    } */
    const isPassCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPassCorrect) {
      logger.error(`${ip}: API /api/v1/user/login  responded password incorrect `);
      return res.status(400).json({ error: "invalid password " });
    }
    const token = jwt.sign({ user: oldUser }, secret, { expiresIn: "12h" });

    logger.info(`${ip}: API /api/v1/login | Login Successfull" `);
    return res.status(200).json({ result: oldUser, token });
  } catch (e) {
    logger.error(`${ip}: API /api/v1/user/login  responnded with Error `);
    return res.status(500).json(e, " Something went wrong");
  }
};

//@desc Delete Product API
//@route POST user/deleteuserimage/:id
//@access Public
const DeleteUserImage = async (req, res) => {
  try {
    const publicId = req.params.id;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);

    res.status(201).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Create User API
//@route POST user/updateuser/:id
//@access Public
const UpdateUser = async (req, res) => {
  const errors = validationResult(req); //checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  //if error return
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API user/updateuser/:id  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const oldUser = await User.findOne({ _id: req.params.id });

  if (!oldUser) {
    logger.error(`${ip}: API user/updateuser/:id  user not found `);
    return res.status(400).json({ message: "user not found" });
  }
  //console.log("update Data", data);

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: data.name,
        mobile_no: data.mobile_no,
        profile: data.profile,
        public_id: data.public_id,
        role: data.role_type || "65edcbe4cf457490bd02a28d",
      },
      {
        new: true,
      }
    );

    logger.info(`${ip}: API user/updateuser/:id  responnded with Success `);
    return res.status(201).json({ result: user });
  } catch (err) {
    logger.error(`${ip}: API user/updateuser/:id  responnded with Error `);
    return res.status(500).json({ message: err.message });
  }
};

//@desc Create User API
//@route POST user/updaterole_type/:id
//@access Public
const UpdateRoleType = async (req, res) => {
  const errors = validationResult(req); //checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  //if error return
  if (!errors.isEmpty()) {
    logger.error(`${ip}: API user/updateuser/:id  responnded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const oldUser = await User.findOne({ _id: req.params.id });

  if (!oldUser) {
    logger.error(`${ip}: API user/updateuser/:id  user not found `);
    return res.status(400).json({ message: "user not found" });
  }
  console.log("user fond");

  console.log("data : ", data, req.params.id);

  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        role_type: data.role_type,
      },
      {
        new: true,
      }
    );

    logger.info(`${ip}: API user/updateuser/:id  responnded with Success `);
    return res.status(201).json({ result: user });
  } catch (err) {
    logger.error(`${ip}: API user/updateuser/:id  responnded with Error `);
    return res.status(500).json({ message: err.message });
  }
};

//@desc Get User by ID API
//@route GET /api/v1/user/get/:id
//@access Public
const GetUserById = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  const userId = req.params.id;
  if (!userId) {
    logger.error(`${ip}: API /api/v1/user/get/:id  responnded UserId required `);
    return res.status(400).json("UserId  requierd");
  }

  try {
    const user = await User.findById({ _id: userId }).populate({ path: "role_type" });

    logger.info(`${ip}: API /api/v1/user/get/:id | responnded with "Got user by ID succesfully" `);
    return res.status(201).json(user);
  } catch {
    logger.error(`${ip}: API /api/v1/user/get/:id  responnded with user not found `);
    return res.status(500).json({ e: "User not found" });
  }
};

//@desc Get Current User API
//@route GET /user/getcurrentuser
//@access Public
const GetCurrentUser = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  try {
    if (!req.user) {
      logger.error(`${ip}: API /api/v1/user/getcurrentuser  responnded with Error , "Unautherized user " `);
      return res.status(500).json({ message: "Unauthorized user" });
    }

    //console.log("current user", req.user);

    logger.info(`${ip}: API /api/v1/getcurrentuser | responnded with "Successfully retreived current user" `);
    return res.status(200).json({ data: req.user, message: "User Retrived" });
  } catch (e) {
    logger.error(`${ip}: API /api/v1/user/getcurrentuser  responnded with Error, " somthing went wrong"`);
    return res.status(500).json({ message: "Something went wrong current user not found" });
  }
};

const GetAllUsers = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client IP address

  try {
    console.log(req.user);
    if (!req.user) {
      return res.status(405).json({ message: "You are not authorized to manage users" });
    }
    const role = await Role_type.findById({ _id: req.user.role_type });
    console.log("role inproduct ", role);
    if (role.value == "user" || role.value == "admin" || !role) {
      return res.status(405).json({ message: "You are not authorized to manage users" });
    }
    // Fetch all users from the database
    const users = await User.find().populate({ path: "role_type" });

    logger.info(`${ip}: API /api/v1/user/getallusers | Responded with "Successfully retrieved all users"`);

    // Return the list of users as a response
    return res.status(200).json({ data: users, message: "All users retrieved successfully" });
  } catch (error) {
    logger.error(`${ip}: API /api/v1/user/getallusers | Responded with Error: ${error.message}`);

    // Return an error response if something goes wrong
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//@desc Create User API
//@route POST user/reset-password
//@access Public
const ResetPassword = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  const data = matchedData(req);
  console.log("data : ", data);

  try {
    const email = await User.findOne({ email: data.email });

    if (!email) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findOneAndUpdate({ email: data.email }, { password: data.password });

    logger.info(`${ip}: API /api/v1/user/user/reset-password responnded with "Got user by ID succesfully" `);
    return res.status(201).json(user);
  } catch {
    logger.error(`${ip}: API /api/v1/user/user/reset-password responnded with user not found `);
    return res.status(500).json({ e: "User not found" });
  }
};

module.exports = {
  ResetPassword,
  UpdateRoleType,
  DeleteUserImage,
  CreateUser,
  GetCurrentUser,

  GetUserById,
  LogInUser,
  TestUserAPI,
  UpdateUser,
  GetAllUsers,
  ResetPassword,
};
