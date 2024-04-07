const mongoose = require("mongoose");

const Role_type = require("./Role_Type.js");

const { Schema } = mongoose;

const UserSchema = new Schema({
  google_id: {
    type: String,
    default: "",
  },
  profile: {
    type: String,
    default: "",
  },
  public_id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: Number,
    required: true,
  },
  role_type: {
    type: "ObjectId",
    ref: "Role_type",
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: true,
  },
  email_varified: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
