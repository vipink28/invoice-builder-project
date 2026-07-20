// models/Invoice.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, default: "" },
  items: { type: [itemSchema], required: true },
  totalAmount: { type: Number, required: true },
  dueDate: { type: String, default: null },
  status: { type: String, default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
