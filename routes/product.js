const express = require("express");
const productRouter = express.Router();
const { body } = require("express-validator");
const { testProductAPI, GetAllProducts, GetProductById, AddProduct, DeleteProduct, DeleteProductImage, UpdateProduct, UpdateProductImage } = require("../controllers/product");
const ValidateToken = require("../middleWare/validateToken");
const multer = require("multer");

// Configure Multer for file upload
const storage = multer.diskStorage({}); // You can configure storage options here if needed
const upload = multer({ storage });

//@desc Test Products API
//@route GET products/
//@access Public
productRouter.get("/", testProductAPI);

//@desc Get All Products API
//@route GET products/getallproducts
//@access Public
productRouter.get("/getallproducts", GetAllProducts);

//@desc Get Product By Id API
//@route GET products/getproduct/:id
//@access Public
productRouter.get("/getproduct/:id", GetProductById);

//@desc Add Product API
//@route POST products/addproduct
//@access Public
productRouter.post("/addproduct", [[body("product_name", " Enter Valid Product_name").notEmpty()], [body("details", "Enter Valid Details").notEmpty()]], [body("product_url", "product_url not found").notEmpty()], [body("public_id", "product_url not found").notEmpty()], AddProduct);

//@desc Delete Product API
//@route POST products/deleteproduct/:id
//@access Public
productRouter.post("/deleteproduct/:id", ValidateToken, DeleteProduct);

//@desc Delete Product API
//@route POST products/deleteproductimage/:id
//@access Public
productRouter.post("/deleteproductimage/:id", ValidateToken, DeleteProductImage);

//@desc Delete Product API
//@route POST products/updateproductimage/:id
//@access Public
productRouter.post("/updateproductimage/:id", [body("public_url", "public_url required").notEmpty()], [body("product_id", "product_id required").notEmpty()], ValidateToken, UpdateProductImage);

//@desc Upadet Product API
//@route POST products/updateproduct/:id
//@access Public
productRouter.post(
  "/updateproduct/:id",
  [body("public_id", "public_id required").notEmpty()],
  [body("product_url", "product_url required").notEmpty()],
  [body("product_name", "product_name required").notEmpty()],
  [body("details", "details required").notEmpty()],
  [body("available", "available required").notEmpty()],
  UpdateProduct
);

module.exports = productRouter;
