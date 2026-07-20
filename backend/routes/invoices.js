const express = require("express");
const { v4: uuidv4 } = require("uuid");

const {
  getInvoicesByUser,
  findInvoiceById,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../db/database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// All invoice routes require login
router.use(authMiddleware);

// Helper to calculate totals on the server (never trust client-only math)
function calculateTotals(items, taxPercent) {
  const subTotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

  const tax = Number(taxPercent) || 0;
  const taxAmount = (subTotal * tax) / 100;
  const grandTotal = subTotal + taxAmount;

  return {
    subTotal: Number(subTotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}

// @route   POST /api/invoices  - create a new invoice
router.post("/", (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      fromName,
      fromEmail,
      fromAddress,
      toName,
      toEmail,
      toAddress,
      items,
      taxPercent,
    } = req.body;

    if (!invoiceNumber || !invoiceDate || !items || !items.length) {
      return res.status(400).json({ message: "Invoice number, date and at least one item are required." });
    }

    const { subTotal, taxAmount, grandTotal } = calculateTotals(items, taxPercent);

    const newInvoice = {
      id: uuidv4(),
      userId: req.user.id,
      invoiceNumber,
      invoiceDate,
      dueDate: dueDate || "",
      fromName: fromName || "",
      fromEmail: fromEmail || "",
      fromAddress: fromAddress || "",
      toName: toName || "",
      toEmail: toEmail || "",
      toAddress: toAddress || "",
      items,
      taxPercent: Number(taxPercent) || 0,
      subTotal,
      taxAmount,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    addInvoice(newInvoice);
    res.status(201).json(newInvoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while creating the invoice." });
  }
});

// @route   GET /api/invoices - list invoices for logged in user
router.get("/", (req, res) => {
  const invoices = getInvoicesByUser(req.user.id).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(invoices);
});

// @route   GET /api/invoices/:id - get single invoice (must belong to user)
router.get("/:id", (req, res) => {
  const invoice = findInvoiceById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found." });
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ message: "You do not have access to this invoice." });
  }
  res.json(invoice);
});

// @route   PUT /api/invoices/:id - update an invoice
router.put("/:id", (req, res) => {
  const invoice = findInvoiceById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found." });
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ message: "You do not have access to this invoice." });
  }

  const { items, taxPercent } = req.body;
  const totals = calculateTotals(items || invoice.items, taxPercent ?? invoice.taxPercent);

  const updated = updateInvoice(req.params.id, {
    ...req.body,
    ...totals,
  });

  res.json(updated);
});

// @route   DELETE /api/invoices/:id
router.delete("/:id", (req, res) => {
  const invoice = findInvoiceById(req.params.id);
  if (!invoice) return res.status(404).json({ message: "Invoice not found." });
  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ message: "You do not have access to this invoice." });
  }

  deleteInvoice(req.params.id);
  res.json({ message: "Invoice deleted successfully." });
});

module.exports = router;
