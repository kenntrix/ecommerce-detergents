import express from "express";
import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from "../controller/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Get all orders
router.get("/", getAllOrders);

// Get order by ID
router.get("/:id", verifyToken, getOrderById);

// Route to fetch orders by user ID
router.get("/user/:userId", verifyToken, getOrdersByUserId);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Delete an order
router.delete("/:id", deleteOrder);

export default router;
