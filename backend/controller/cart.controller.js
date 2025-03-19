import Cart from "../models/cart.models.js";
import { errorHandler } from "../utils/error.js";

// Add to cart
export const addToCart = async (request, response, next) => {
  try {
    const { userId, productId, quantity } = request.body;

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new cart with the product
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      // If a cart exists, ensure it contains only one product
      cart.items = [{ productId, quantity }]; // Replace the existing product with the new one
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
