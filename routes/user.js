const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateToken = require("../middleWare/validateToken.js");
const { ChangeUserRole, CreateUser, GetCurrentUser, GetUserById, LogInUser, TestUserAPI, UpdateUser } = require("../controllers/user");

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
//@route POST user/updateuser/:id
//@access Public
router.post("/updateuser/:id", [body("name"), body("mobile_no"), body("role_type")], UpdateUser);

//@desc Get User Info API
//@route post user/get/:id
//@access Public
router.get("/get/:id", GetUserById);

//@desc Change Role_Type API
//@route post user/change-role/:id
//@access Public
router.put("/change-role/:id", [body("role_type", "Enter Valid Role_Type").isEmail()], ChangeUserRole);

//@desc Test User API
//@route GET /api/v1/user
//@access Public
router.get("/", TestUserAPI);

//@desc Get Current User API
//@route GET /user
//@access Public
router.get("/getcurrentuser", validateToken, GetCurrentUser);

module.exports = router;
