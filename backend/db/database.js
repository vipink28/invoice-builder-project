// Simple JSON-file based "database".
// For a 3-week training project, this avoids the overhead of a real SQL/SQLite
// setup while still teaching students the concept of a persistence layer.
// All reads/writes go through this single module so it's easy to swap out
// later for a real database if needed.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- USERS ----------
function getUsers() {
  return readDB().users;
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return getUsers().find((u) => u.id === id);
}

function addUser(user) {
  const data = readDB();
  data.users.push(user);
  writeDB(data);
  return user;
}

// ---------- INVOICES ----------
function getInvoices() {
  return readDB().invoices;
}

function getInvoicesByUser(userId) {
  return getInvoices().filter((inv) => inv.userId === userId);
}

function findInvoiceById(id) {
  return getInvoices().find((inv) => inv.id === id);
}

function addInvoice(invoice) {
  const data = readDB();
  data.invoices.push(invoice);
  writeDB(data);
  return invoice;
}

function updateInvoice(id, updates) {
  const data = readDB();
  const index = data.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return null;
  data.invoices[index] = { ...data.invoices[index], ...updates };
  writeDB(data);
  return data.invoices[index];
}

function deleteInvoice(id) {
  const data = readDB();
  const index = data.invoices.findIndex((inv) => inv.id === id);
  if (index === -1) return false;
  data.invoices.splice(index, 1);
  writeDB(data);
  return true;
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
