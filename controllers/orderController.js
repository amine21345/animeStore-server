const Order = require("../models/orderModel");
const sendEmail = require("../config/mailer");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const order = new Order(req.body);
    let savedOrder = await order.save();
    // Populate product basic info for email if available
    try {
      savedOrder = await savedOrder.populate({
        path: "items.product",
        select: "name price",
      });
    } catch (_) {}

    // Fire-and-forget customer + owner emails (don't fail order if email errors)
    (async () => {
      try {
        const orderId = savedOrder._id.toString();
        const itemsLines = (savedOrder.items || [])
          .map((it) => {
            const name =
              it.product && it.product.name ? it.product.name : "Product";
            const qty = it.quantity || 0;
            const color = it.color ? ` (${it.color})` : "";
            return `• ${name}${color} × ${qty}`;
          })
          .join("\n");
        const total = savedOrder.totalAmount || 0;
        const subject = `Order Confirmation #${orderId}`;
        const text = `Thank you for your order!\n\nOrder ID: ${orderId}\nStatus: ${savedOrder.status}\nTotal: $${total}\n\nItems:\n${itemsLines}`;
        const html = `<h1 style=\"margin:0 0 16px;font-size:20px;font-family:Arial,sans-serif\">Thank you for your order!</h1>
<p style=\"margin:4px 0;font-family:Arial,sans-serif\"><strong>Order ID:</strong> ${orderId}</p>
<p style=\"margin:4px 0;font-family:Arial,sans-serif\"><strong>Status:</strong> ${
          savedOrder.status
        }</p>
<p style=\"margin:4px 0 12px;font-family:Arial,sans-serif\"><strong>Total:</strong> $${total}</p>
<p style=\"margin:8px 0 4px;font-family:Arial,sans-serif\"><strong>Items:</strong></p>
<ul style=\"padding-left:18px;margin:4px 0 16px;font-family:Arial,sans-serif\">${(
          savedOrder.items || []
        )
          .map((it) => {
            const name =
              it.product && it.product.name ? it.product.name : "Product";
            const qty = it.quantity || 0;
            const color = it.color ? ` (${it.color})` : "";
            return `<li>${name}${color} × ${qty}</li>`;
          })
          .join("")}</ul>
<p style=\"font-family:Arial,sans-serif\">We'll notify you when your order status changes.</p>`;
        // Customer email
        await sendEmail({ to: savedOrder.email, subject, text, html });

        // Owner notification
        const ownerEmail = process.env.OWNER_EMAIL || process.env.MAIL_USER;
        if (ownerEmail) {
          const ownerSubject = `New Order #${orderId} ($${total})`;
          const ownerText = `New order received.\nOrder ID: ${orderId}\nCustomer: ${savedOrder.firstName} ${savedOrder.lastName} <${savedOrder.email}>\nTotal: $${total}\nItems:\n${itemsLines}`;
          const ownerHtml = `<h2 style=\"margin:0 0 12px;font-family:Arial,sans-serif;font-size:18px\">New Order Received</h2>
<p style=\"margin:4px 0;font-family:Arial,sans-serif\"><strong>Order ID:</strong> ${orderId}</p>
<p style=\"margin:4px 0;font-family:Arial,sans-serif\"><strong>Customer:</strong> ${
            savedOrder.firstName
          } ${savedOrder.lastName} &lt;${savedOrder.email}&gt;</p>
<p style=\"margin:4px 0;font-family:Arial,sans-serif\"><strong>Total:</strong> $${total}</p>
<p style=\"margin:8px 0 4px;font-family:Arial,sans-serif\"><strong>Items:</strong></p>
<ul style=\"padding-left:18px;margin:4px 0 16px;font-family:Arial,sans-serif\">${(
            savedOrder.items || []
          )
            .map((it) => {
              const name =
                it.product && it.product.name ? it.product.name : "Product";
              const qty = it.quantity || 0;
              const color = it.color ? ` (${it.color})` : "";
              return `<li>${name}${color} × ${qty}</li>`;
            })
            .join("")}</ul>`;
          try {
            await sendEmail({
              to: ownerEmail,
              subject: ownerSubject,
              text: ownerText,
              html: ownerHtml,
            });
          } catch (notifyErr) {
            console.error(
              "Owner notification email failed:",
              notifyErr.message
            );
          }
        }
      } catch (err) {
        console.error("Order confirmation email failed:", err.message);
      }
    })();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
