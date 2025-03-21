import Product from "../models/product.models.js";
import cloudinary from "../utils/cloudinary.js";
import { errorHandler } from "../utils/error.js";

// Create a new product
export const createProduct = async (request, response, next) => {
  try {
    const { name, description, price, stock, category } = request.body;

    // Ensure images were uploaded
    if (!request.images || request.images.length === 0) {
      return next(errorHandler(400, "At least one image is required"));
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      images: request.images,
    });
    await product.save();
    response.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(errorHandler(500, "Error creating product"));
  }
};

// Get all products for customers
export const getAllProducts = async (request, response, next) => {
  try {
    const { searchTerm, inStock, outOfStock, productTypes, sort, limit } =
      request.query;

    let filter = {};

    // Search by product name (case-insensitive)
    if (searchTerm) {
      filter.name = { $regex: searchTerm, $options: "i" };
    }

    // Filter by stock availability
    if (inStock === "true" && outOfStock !== "true") {
      filter.stock = { $gt: 0 }; // Products in stock
    } else if (outOfStock === "true" && inStock !== "true") {
      filter.stock = { $lte: 0 }; // Products out of stock
    }

    // Filter by category (previously product type)
    if (productTypes) {
      const typesArray = productTypes.split(",");
      filter.category = { $in: typesArray };
    }

    // Sorting logic
    let sortOption = {};
    if (sort === "price_desc") {
      sortOption.price = -1; // Highest to lowest price
    } else if (sort === "price_asc") {
      sortOption.price = 1; // Lowest to highest price
    } else if (sort === "createdAt_desc") {
      sortOption.createdAt = -1; // Newest first
    } else if (sort === "createdAt_asc") {
      sortOption.createdAt = 1; // Oldest first
    }

    // Convert limit to a number and set default (no limit if not provided)
    const productLimit = limit ? parseInt(limit, 10) : undefined;

    // Fetch products with optional limit
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(productLimit);

    response.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to get all products", error));
  }
};

// Get a single product by ID
export const getProductById = async (request, response, next) => {
  try {
    const productId = request.params.id;
    const product = await Product.findById(productId);
    if (!product) return next(errorHandler(404, "Product not found"));

    response.status(200).json(product);
  } catch (error) {
    next(errorHandler(500, "Error fetching product"));
  }
};

// Update a product
export const updateProduct = async (request, response, next) => {
  try {
    const { name, description, price, stock, category } = request.body;
    const productId = request.params.id;

    // Ensure images were uploaded
    if (!request.images || request.images.length === 0) {
      return next(errorHandler(400, "At least one image is required"));
    }

    // Fetch the existing product to get its current images
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) return next(errorHandler(404, "Product not found"));

    // Extract public IDs of existing images and delete them from Cloudinary
    if (existingProduct.images && existingProduct.images.length > 0) {
      for (const imageUrl of existingProduct.images) {
        try {
          // Extract the public ID from the image URL
          const publicId = imageUrl.split("/").pop().split(".")[0];

          // Delete the image from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error(
            `Error deleting image from Cloudinary: ${error.message}`
          );
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, stock, category, images: request.images },
      { new: true, runValidators: true }
    );

    response.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    next(errorHandler(500, "Error updating product"));
  }
};

// Delete a product
export const deleteProduct = async (request, response, next) => {
  try {
    const productId = request.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    // Delete each image from Cloudinary and local storage
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Extract public ID from Cloudinary URL
          const publicId = imageUrl.split("/").pop().split(".")[0];

          // Delete from Cloudinary
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Error deleting from Cloudinary: ${error.message}`);
        }
      }
    }

    await Product.findByIdAndDelete(productId);
    response.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(errorHandler(500, "Error deleting product"));
  }
};
