import Order from "../models/order.models.js";
import Payment from "../models/payment.models.js";
import Product from "../models/product.models.js";
import { errorHandler } from "../utils/error.js";
import stripe from "../utils/Stripe.js";

export const createPayment = async (request, response, next) => {
  try {
    const { items, total_price } = request.body;
    const userId = request.user.id;

    // Validate input fields
    if (!items || !Array.isArray(items) || items.length === 0 || !total_price) {
      return next(errorHandler(400, "All fields are required."));
    }

    if (isNaN(total_price) || total_price <= 0) {
      return next(
        errorHandler(400, "Payment amount must be a positive number.")
      );
    }

    // Validate each item in the cart
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(errorHandler(404, `Product not found: ${item.productId}`));
      }

      if (product.stock < item.quantity) {
        return next(
          errorHandler(400, `Insufficient stock for product: ${product.name}`)
        );
      }
    }

    // Deduct stock levels for all products
    for (const item of items) {
      const product = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }, // Deduct stock based on quantity
        { new: true } // Return the updated product document
      );

      if (!product || product.stock < 0) {
        return next(errorHandler(400, "Failed to update stock levels."));
      }
    }

    // Convert payment amount to cents (Stripe works in cents)
    const amountInCents = Math.round(total_price * 100);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // Amount in cents
      currency: "kes", // Use "usd" or another supported currency if needed
      metadata: { userId },
    });

    if (!paymentIntent || !paymentIntent.id) {
      return next(errorHandler(500, "Failed to create payment intent."));
    }

    // Create a payment record
    const payment = new Payment({
      userId,
      total_price,
      payment_date: new Date(),
      payment_status: "completed",
      payments: [
        {
          amount: total_price,
          date: new Date(),
          status: "completed",
          transaction_id: paymentIntent.id,
        },
      ],
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await payment.save();

    // Create an order
    const order = new Order({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: total_price,
      paymentStatus: "Paid", // Mark as paid since payment was successful
    });

    await order.save();

    response.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      message: "Payment successful and order created.",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    next(errorHandler(500, "Error processing payment."));
  }
};
