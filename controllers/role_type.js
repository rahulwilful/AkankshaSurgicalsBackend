const logger = require("../config/logger.js");
const { validationResult, matchedData } = require("express-validator");
const Role_type = require("../models/Role_Type");

const testRole_typeAPI = async (req, res) => {
  return res.status(200).send("Role_type API test successfull");
};

//@desc Get All Role_types API
//@route GET /api/v1/Role_type/getall
//@access Public
const GetAllRole_types = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const allDepts = await Role_type.find({ active: true });
    /* console.log(allDepts); */
    logger.info(`${ip}: API /api/v1/Role_type/getalldepts | responded with "Fetched all the Role_types" `);
    return res.status(200).json({ result: allDepts });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/Role_type/getalldepts  responded with Error  " somethung went wrong" `);
    return res.status(500).json({ error: err, message: "Something went wrong" });
  }
};

//@desc Get Role_type By Name API
//@route GET /api/v1/Role_type/getdeptbyname
//@access Public
const GetRole_typeByName = async (req, res) => {
  const errors = validationResult(req); //checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //wats remote address?

  if (!errors.isEmpty()) {
    logger.error(`${ip}: API /api/v1/Role_type/login  responded with Error `);
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  try {
    const deptName = await Role_type.findOne({ name: data.name });
    /* console.log(allDepts); */
    logger.info(`${ip}: API /api/v1/Role_type/getalldepts | responded with "Fetched all the Role_types" `);
    return res.status(200).json({ result: deptName });
  } catch (err) {
    logger.error(`${ip}: API /api/v1/Role_type/getalldepts responded with Error  " somethung went wrong" `);
    return res.status(500).json({ error: err, message: "Something went wrong" });
  }
};

module.exports = {
  testRole_typeAPI,
  GetAllRole_types,
  GetRole_typeByName,
};
