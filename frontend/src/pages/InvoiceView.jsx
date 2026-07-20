import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/invoices/${id}`)
      .then((res) => setInvoice(res.data))
      .catch(() => setError("Invoice not found or you do not have access to it."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      navigate("/my-invoices");
    } catch (err) {
      alert("Failed to delete invoice.");
    }
  }

  if (loading) {
    return <p className="text-emerald-300 text-center py-16">Loading invoice...</p>;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-300 mb-4">{error}</p>
        <Link to="/my-invoices" className="text-emerald-400 hover:underline">
          Back to My Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link to="/my-invoices" className="text-emerald-400 hover:underline text-sm">
          ← Back to My Invoices
        </Link>
        <div className="space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Print
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">INVOICE</h1>
            <p className="text-emerald-300">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right text-sm text-emerald-200">
            <p>Invoice Date: {invoice.invoiceDate}</p>
            {invoice.dueDate && <p>Due Date: {invoice.dueDate}</p>}
          </div>
        </div>

        {/* From / To */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-emerald-400 text-xs uppercase font-semibold mb-1">From</h2>
            <p className="text-white font-medium">{invoice.fromName}</p>
            <p className="text-emerald-200 text-sm">{invoice.fromEmail}</p>
            <p className="text-emerald-200 text-sm whitespace-pre-line">{invoice.fromAddress}</p>
          </div>
          <div>
            <h2 className="text-emerald-400 text-xs uppercase font-semibold mb-1">Bill To</h2>
            <p className="text-white font-medium">{invoice.toName}</p>
            <p className="text-emerald-200 text-sm">{invoice.toEmail}</p>
            <p className="text-emerald-200 text-sm whitespace-pre-line">{invoice.toAddress}</p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-left text-emerald-400 uppercase text-xs border-b border-emerald-800">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-emerald-800/60">
                <td className="py-2 text-emerald-100">{item.description}</td>
                <td className="py-2 text-right text-emerald-100">{item.quantity}</td>
                <td className="py-2 text-right text-emerald-100">
                  {Number(item.price).toFixed(2)}
                </td>
                <td className="py-2 text-right text-emerald-100">
                  {(Number(item.quantity) * Number(item.price)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-2 text-sm">
            <div className="flex justify-between text-emerald-200">
              <span>Subtotal</span>
              <span>{invoice.subTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>Tax ({invoice.taxPercent}%)</span>
              <span>{invoice.taxAmount?.toFixed(2)}</span>
            </div>
            <div className="border-t border-emerald-700 pt-2 flex justify-between text-white text-lg font-bold">
              <span>Grand Total</span>
              <span>{invoice.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
