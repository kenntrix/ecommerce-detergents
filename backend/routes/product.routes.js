import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controller/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import { uploadMultiple } from "../utils/uploadImage.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Create a new product
router.post(
  "/add-product",
  verifyToken,
  verifyAdmin,
  upload.array("images", 6),
  uploadMultiple,
  createProduct
);

// Get all products
router.get("/", getAllProducts);

// Get a single product by ID
router.get("/:id", getProductById);

// Update a product
router.put(
  "/update-product/:id",
  verifyToken,
  verifyAdmin,
  upload.array("images", 6),
  uploadMultiple,
  updateProduct
);

// Delete a product
router.delete("/delete-product/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
