import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyItem = { description: "", quantity: 1, price: 0 };

function generateInvoiceNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${random}`;
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");

  const [fromName, setFromName] = useState(user?.name || "");
  const [fromEmail, setFromEmail] = useState(user?.email || "");
  const [fromAddress, setFromAddress] = useState("");

  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [items, setItems] = useState([{ ...emptyItem }]);
  const [taxPercent, setTaxPercent] = useState(0);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateItem(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { ...emptyItem }]);
  }

  function removeItem(index) {
    if (items.length === 1) return; // keep at least one row
    setItems(items.filter((_, i) => i !== index));
  }

  function itemAmount(item) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return qty * price;
  }

  const subTotal = items.reduce((sum, item) => sum + itemAmount(item), 0);
  const taxAmount = (subTotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = subTotal + taxAmount;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validItems = items.filter((item) => item.description.trim() !== "");
    if (validItems.length === 0) {
      setError("Please add at least one item with a description.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/invoices", {
        invoiceNumber,
        invoiceDate,
        dueDate,
        fromName,
        fromEmail,
        fromAddress,
        toName,
        toEmail,
        toAddress,
        items: validItems,
        taxPercent,
      });
      navigate("/my-invoices");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Create Invoice</h1>

      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-200 text-sm rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice meta */}
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-emerald-200 text-sm mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-emerald-200 text-sm mb-1">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-emerald-200 text-sm mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* From / To */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6 space-y-3">
            <h2 className="text-emerald-300 font-semibold mb-1">From</h2>
            <input
              type="text"
              placeholder="Your name / business"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Your email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Your address"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              rows={2}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6 space-y-3">
            <h2 className="text-emerald-300 font-semibold mb-1">Bill To</h2>
            <input
              type="text"
              placeholder="Client name / business"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Client email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Client address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              rows={2}
              className="w-full bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Items */}
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6">
          <h2 className="text-emerald-300 font-semibold mb-4">Items</h2>

          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs text-emerald-400 uppercase mb-2 px-1">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  className="col-span-12 sm:col-span-5 bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  className="col-span-4 sm:col-span-2 bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                  className="col-span-4 sm:col-span-2 bg-emerald-950 border border-emerald-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="col-span-3 sm:col-span-2 text-emerald-100 px-2">
                  {itemAmount(item).toFixed(2)}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="col-span-1 text-red-400 hover:text-red-300 text-xl leading-none"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
          >
            + Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6">
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-3">
              <div className="flex justify-between items-center text-emerald-200 text-sm">
                <span>Subtotal</span>
                <span>{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-200 text-sm">
                <span>Tax (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  className="w-20 bg-emerald-950 border border-emerald-700 rounded-md px-2 py-1 text-white text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-between items-center text-emerald-200 text-sm">
                <span>Tax Amount</span>
                <span>{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-emerald-700 pt-3 flex justify-between items-center text-white text-lg font-bold">
                <span>Grand Total</span>
                <span>{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          {loading ? "Saving..." : "Save Invoice"}
        </button>
      </form>
    </div>
  );
}
