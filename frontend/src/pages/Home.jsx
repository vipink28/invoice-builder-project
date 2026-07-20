import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-emerald-800/50 text-emerald-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
          Simple. Fast. Free.
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Create professional invoices in seconds
        </h1>
        <p className="text-emerald-200 text-lg mb-8">
          InvoiceGen helps you build, manage and track all your invoices in one place.
          No spreadsheets, no hassle — just clean invoices your clients will love.
        </p>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link
              to="/create-invoice"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create an Invoice
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border border-emerald-700 hover:bg-emerald-900 text-emerald-100 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-6 mt-20">
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6">
          <div className="text-2xl mb-3">🧾</div>
          <h3 className="text-white font-semibold mb-2">Quick Invoice Creation</h3>
          <p className="text-emerald-200 text-sm">
            Add line items, taxes, and addresses. Totals are calculated automatically.
          </p>
        </div>
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6">
          <div className="text-2xl mb-3">📂</div>
          <h3 className="text-white font-semibold mb-2">Manage All Invoices</h3>
          <p className="text-emerald-200 text-sm">
            View, revisit, and delete every invoice you've created from one dashboard.
          </p>
        </div>
        <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-6">
          <div className="text-2xl mb-3">🔒</div>
          <h3 className="text-white font-semibold mb-2">Your Data, Secured</h3>
          <p className="text-emerald-200 text-sm">
            Every account is private — only you can see and manage your own invoices.
          </p>
        </div>
      </div>
    </div>
  );
}
