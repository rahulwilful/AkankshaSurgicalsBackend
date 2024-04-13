const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateToken = require("../middleWare/validateToken.js");
const { CreateUser, DeleteUserImage, GetAllUsers, GetCurrentUser, GetUserById, LogInUser, ResetPassword, TestUserAPI, UpdateRoleType, UpdateUser } = require("../controllers/user");

//@desc Create User API
//@route POST user/signup
//@access Public
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("mobile_no", "Enter a Valid Whatsapp Number").notEmpty().isNumeric(),
    body("password", "Password must have atlest 5 character").isLength({
      min: 5,
    }),
    body("role_type"),
  ],
  CreateUser
);

//@desc LogIn User API
//@route post user/login
//@access Public
router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Is Incorrect").isLength({
      min: 5,
    }),
  ],
  LogInUser
);

//@desc Create User API
//@route POST user/updaterole_type/:id
//@access Public
router.post("/updaterole_type/:id", [body("role_type")], UpdateRoleType);

//@desc Create User API
//@route POST user/updateuser/:id
//@access Public
router.post("/updateuser/:id", [body("name"), body("mobile_no"), body("role_type"), body("profile"), body("public_id")], UpdateUser);

//@desc Create User API
//@route POST user/reset-password
//@access Public
router.post("/reset-password", [body("password"), body("email")], ResetPassword);

//@desc Delete Product API
//@route POST products/deleteproductimage/:id
//@access Public
router.post("/deleteuserimage/:id", DeleteUserImage);

//@desc Get User Info API
//@route post user/get/:id
//@access Public
router.get("/get/:id", GetUserById);

//@desc Test User API
//@route GET /api/v1/user
//@access Public
router.get("/", TestUserAPI);

//@desc Test User API
//@route GET /getalluser
//@access Public
router.get("/getallusers", validateToken, GetAllUsers);

//@desc Get Current User API
//@route GET /user
//@access Public
router.get("/getcurrentuser", validateToken, GetCurrentUser);

module.exports = router;
