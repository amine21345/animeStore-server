const Order = require("../models/orderModel");
const sendEmail = require("../config/mailer");
const {
  customerOrderTemplate,
  adminOrderTemplate,
} = require("../template/emailTemplates");
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const order = new Order(req.body);
    let savedOrder = await order.save();

    savedOrder = await savedOrder.populate({
      path: "items.product",
      select: "name price",
    });

    const locale = (req.body.locale || "en").toLowerCase();
    const safeLocale = ["en", "fr", "ar"].includes(locale) ? locale : "en";

    const subjectMap = {
      en: (id) => `Order Confirmation #${id}`,
      fr: (id) => `Confirmation de commande #${id}`,
      ar: (id) => `تأكيد الطلب رقم ${id}`,
    };

    await sendEmail({
      to: savedOrder.email,
      subject: subjectMap[safeLocale](savedOrder._id),
      html: customerOrderTemplate(savedOrder, safeLocale),
    });

    // Send admin email (always English for now)
    const ownerEmail = process.env.OWNER_EMAIL || process.env.MAIL_USER;
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject: `New Order #${savedOrder._id} ($${savedOrder.totalAmount})`,
        html: adminOrderTemplate(savedOrder, "en"),
      });
    }

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
