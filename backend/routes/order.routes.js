import express from 'express'   
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrderStatus } from '../controller/order.controller.js';

const router = express.Router()

// Create an order
router.post('/orders', createOrder);

// Get all orders
router.get('/orders', getAllOrders);

// Get order by ID
router.get('/orders/:id', getOrderById);

// Update order status
router.put('/orders/:id/status', updateOrderStatus);

// Delete an order
router.delete('/orders/:id', deleteOrder);

export default router 