const { validationResult, matchedData } = require("express-validator");
const Product = require("../models/Product");
const multer = require("multer");

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Controller function to test Products API
const testProductAPI = (req, res) => {
  res.send("Test Products API");
};

//@desc Get All Products API
//@route GET products/getallproducts
//@access Public
const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Get Product By Id API
//@route GET products/getproduct/:id
//@access Public
const GetProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(201).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Add Product API
//@route POST products/addproduct
//@access Public
const AddProduct = async (req, res) => {
  const errors = validationResult(req); // Checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client's IP address

  const data = matchedData(req);
  console.log("req body : ", req.body);
  console.log("data : ", data);

  try {
    // Find the maximum position value from existing products
    const maxPositionProduct = await Product.findOne().sort({ position: -1 });

    // Calculate the new position for the new product
    let newPosition = 1;
    if (maxPositionProduct) {
      newPosition = maxPositionProduct.position + 1;
    }

    // Create a new product object with image URL and incremented position
    const product = new Product({
      product_url: data.product_url, // Image URL from Cloudinary
      public_id: data.public_id,
      product_name: data.product_name,
      details: data.details,
      category: data.category || "", // Default category to empty string if not provided
      sub_category: data.sub_category || "", // Default sub_category to empty string if not provided
      position: newPosition, // Incremented position value
      available: data.available || true, // Default available to true if not provided
    });

    // Save the product to the database
    const newProduct = await product.save();

    // Respond with the new product data
    res.status(200).json(newProduct);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

//@desc Delete Product API
//@route POST products/deleteproduct/:id
//@access Public
const DeleteProduct = async (req, res) => {
  try {
    const publicId = req.params.id;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    await Product.findOneAndDelete({ public_id: req.params.id });
    res.status(201).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Delete Product API
//@route POST products/deleteproductimage/:id
//@access Public
const DeleteProductImage = async (req, res) => {
  try {
    const publicId = req.params.id;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);

    res.status(201).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

RepositionProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

UpdateProductImage = async (req, res) => {
  const errors = validationResult(req); // Checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client's IP address

  const data = req.body;
  console.log("_id ", req.params.id);
  console.log(data);
  await Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      product_url: req.body.product_url, // Image URL from Cloudinary
      public_id: req.body.public_id,
    },
    {
      new: true,
    }
  )
    .then((product) => {
      return res.status(201).json({ result: product });
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

UpdateProduct = async (req, res) => {
  const errors = validationResult(req); // Checking for validations
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get client's IP address

  const data = matchedData(req);
  const id = req.params.id;
  console.log("data", data);

  try {
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        product_name: data.product_name,
        details: data.details,
        available: data.available,
      }
    );
    return res.status(201).json({ result: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  testProductAPI,
  GetAllProducts,
  GetProductById,
  AddProduct,
  DeleteProduct,
  DeleteProductImage,
  UpdateProduct,
  UpdateProductImage,
  upload,
};
