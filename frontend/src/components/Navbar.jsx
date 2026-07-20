import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-emerald-950 border-b border-emerald-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-300 tracking-tight">
          Invoice<span className="text-emerald-500">Gen</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link to="/" className="text-emerald-100 hover:text-emerald-400 transition-colors px-2 py-1">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/my-invoices"
                className="text-emerald-100 hover:text-emerald-400 transition-colors px-2 py-1"
              >
                My Invoices
              </Link>
              <Link
                to="/create-invoice"
                className="text-emerald-100 hover:text-emerald-400 transition-colors px-2 py-1"
              >
                Create Invoice
              </Link>
              <Link
                to="/profile"
                className="text-emerald-100 hover:text-emerald-400 transition-colors px-2 py-1"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-emerald-100 hover:text-emerald-400 transition-colors px-2 py-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
