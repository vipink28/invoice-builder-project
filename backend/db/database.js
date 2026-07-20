const User = require("../models/User");
const Invoice = require("../models/Invoice");

// ---------- USERS ----------

async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function findUserById(id) {
  try {
    return await User.findById(id);
  } catch (err) {
    // Invalid ObjectId format -> treat as "not found" rather than crashing
    return null;
  }
}

async function addUser(user) {
  return User.create(user); // user = { name, email, password }
}

// ---------- INVOICES ----------

async function getInvoicesByUser(userId) {
  return Invoice.find({ userId }).sort({ createdAt: -1 });
}

async function findInvoiceById(id) {
  try {
    return await Invoice.findById(id);
  } catch (err) {
    return null;
  }
}

async function addInvoice(invoice) {
  return Invoice.create(invoice);
}

async function updateInvoice(id, updates) {
  try {
    return await Invoice.findByIdAndUpdate(id, updates, { new: true });
  } catch (err) {
    return null;
  }
}

async function deleteInvoice(id) {
  try {
    const result = await Invoice.findByIdAndDelete(id);
    return result !== null;
  } catch (err) {
    return false;
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  addUser,
  getInvoicesByUser,
  findInvoiceById,
  addInvoice,
  updateInvoice,
  deleteInvoice,
};
