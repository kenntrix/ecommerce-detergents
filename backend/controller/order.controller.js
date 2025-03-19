import Order from "../models/order.models.js";
import { errorHandler } from "../utils/error.js";
import Product from "../models/product.models.js";

// Create an order
export const createOrder = async (request, response) => {
  try {
    const { userId, items } = request.body;

    // Check stock levels
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return next(
          errorHandler(400, "Insufficient stock for one or more items")
        );
      }
    }

    // Reduce stock levels
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({ userId, items, totalAmount });
    await order.save();
    response
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    next(errorHandler(500, "Error placing order"));
  }
};

// Get all orders
export const getAllOrders = async (request, response, next) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId");
    response.json(orders);
  } catch (error) {
    next(errorHandler(500, "Error fetching orders"));
  }
};

// Get order by ID
export const getOrderById = async (request, response, next) => {
  try {
    const order = await Order.findById(request.params.id)
      .populate("userId")
      .populate("items.productId");
    if (!order) return next(errorHandler(404, "Order not found"));
    response.json(order);
  } catch (error) {
    next(errorHandler(500, "Error fetching order"));
  }
};

// Update order status
export const updateOrderStatus = async (request, response, next) => {
  try {
    const { status } = request.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return next(errorHandler(404, "Order not found"));
    response.json(updatedOrder);
  } catch (error) {
    next(errorHandler(500, "Error updating order status"));
  }
};

// Delete an order
export const deleteOrder = async (request, response, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(request.params.id);
    if (!deletedOrder) return next(errorHandler(404, "Order not found"));
    response.json({ message: "Order deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Error deleting order"));
  }
};
