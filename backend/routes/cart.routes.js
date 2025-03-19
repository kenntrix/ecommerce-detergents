import express from "express";
import {
  addToCart,
  clearCart,
  getCartByUserId,
  removeItemFromCart,
  updateCartItem,
} from "../controller/cart.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Add item to cart
router.post("/add", verifyToken, addToCart);

// Get cart by user ID
router.get("/:userId", verifyToken, getCartByUserId);

// Update cart item quantity
router.put("/update", verifyToken, updateCartItem);

// Remove item from cart
router.delete("/remove", verifyToken, removeItemFromCart);

// Clear cart
router.delete("/clear/:userId", verifyToken, clearCart);

export default router;
