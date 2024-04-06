const express = require("express");
const role_typeRouter = express.Router();
const { body } = require("express-validator");
const { testRole_typeAPI, GetAllRole_types, GetRole_typeByName } = require("../controllers/role_type");
const ValidateToken = require("../middleWare/validateToken");

//@desc Test Role_type API
//@route GET /api/v1/role_type
//@access Public
role_typeRouter.get("/", testRole_typeAPI);

//@desc Get All Role_types API
//@route GET /api/v1/role_type/getallrole_types
//@access Public
role_typeRouter.get("/getallrole_types", GetAllRole_types);

//@desc Get Role_type By Name API
//@route GET /api/v1/role_type/getrole_typebyname
//@access Public
role_typeRouter.get("/getrole_typebyname", [body("name", "Enter Valid Name").notEmpty()], GetRole_typeByName);

module.exports = role_typeRouter;
