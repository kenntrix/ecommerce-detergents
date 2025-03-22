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

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        userId,
        items: [{ productId, quantity }], // Initialize with the first item
      });
    } else {
      // Check if the product is already in the cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // Update the quantity if the product already exists
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add the product as a new item if it doesn't exist
        cart.items.push({ productId, quantity });
      }
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
    const { productId } = request.body;
    const userId = request.user.id;

    // Validate productId
    if (!productId) {
      return next(errorHandler(400, "Product ID is required"));
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return next(errorHandler(404, "Cart not found"));
    }

    // Filter out the item to be removed
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Check if the item was removed
    if (cart.items.length === initialItemCount) {
      return response.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Save the updated cart
    await cart.save();

    response.status(200).json({
      success: true,
      message: "Removed cart item successfully",
      cart,
    });
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
