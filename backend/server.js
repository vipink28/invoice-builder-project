require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoices");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Invoice Generator API is running." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
