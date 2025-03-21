import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";
import { errorHandler } from "../utils/error.js";

// Add to cart
export const addToCart = async (request, response, next) => {
  try {
    const { productId, quantity } = request.body;
    const userId = request.user.id; // Extract user ID from the token

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    // Check if the product is already in the cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity; // Increment quantity if product already exists
    } else {
      cart.items.push({ productId, quantity }); // Add new product to the cart
    }

    // Save the updated cart
    await cart.save();

    response.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    next(errorHandler(500, "Error adding to cart"));
  }
};

// Get cart by user ID
export const getCartByUserId = async (request, response, next) => {
  try {
    const userId = request.params.userId;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return next(errorHandler(404, "Cart not found"));

    // Calculate the total number of items in the cart
    const totalItems = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );

    response.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
      totalItems,
    });
  } catch (error) {
    next(errorHandler(500, "Error fetching cart"));
  }
};

// Update cart item quantity
export const updateCartItem = async (request, response, next) => {
  try {
    const { userId, productId, quantity } = request.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return next(errorHandler(404, "Cart not found"));

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      response
        .status(200)
        .json({ success: true, message: "Cart updated succefully", cart });
    } else {
      next(errorHandler(404, "Item not found in cart"));
    }
  } catch (error) {
    next(errorHandler(500, "Error updating cart item"));
  }
};

// Remove item from cart
export const removeItemFromCart = async (request, response, next) => {
  try {
    const { userId, productId } = request.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return next(errorHandler(404, "Cart not found"));

    cart.items = cart.items.filter((item) => item.productId != productId);
    await cart.save();
    response
      .status(200)
      .json({ success: true, message: "Removed cart item succesfully", cart });
  } catch (error) {
    next(errorHandler(500, "Error removing item from cart"));
  }
};

// Clear cart
export const clearCart = async (request, response, next) => {
  try {
    const userId = request.params.userId;
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );
    if (!cart) return next(errorHandler(404, "Cart not found"));

    response
      .status(200)
      .json({ success: true, message: "Cart deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Error clearing cart"));
  }
};
