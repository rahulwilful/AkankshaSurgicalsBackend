const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectToMongo = require("./config/db.js");

const multer = require("multer");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

connectToMongo();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  return res.status(200).send("Welcome To The Back-End Of The Akanksha Surgicals");
});

const upload2 = multer({ dest: "uploads/" }); // Destination folder for multer to store temporary files

app.post("/product/uploadimage", upload2.single("image"), (req, res) => {
  const image = req.file.path; // Path to the uploaded file
  console.log("Uploaded image path:", image);

  cloudinary.uploader.upload(image, (error, result) => {
    // Delete the temporary file uploaded by multer
    fs.unlinkSync(image);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message, message: "Something went wrong while uploading image" });
    } else {
      console.log(result);
      return res.status(201).json({ result });
    }
  });
});

app.use("/role_type", require("./routes/role_type.js"));
app.use("/user", require("./routes/user.js"));
app.use("/product", require("./routes/product.js"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
