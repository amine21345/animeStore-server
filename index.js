const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/mail", require("./routes/mailRoutes"));
app.use("/api/users", require("./routes/userRoutes")); // Add userRoutes
app.use("/api/orders", require("./routes/orderRoutes")); // Add orderRoutes

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
