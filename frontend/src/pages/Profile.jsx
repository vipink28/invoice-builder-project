import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-700 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-emerald-300 mb-6">{user.email}</p>

        <div className="text-left bg-emerald-950 border border-emerald-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-400">Name</span>
            <span className="text-white">{user.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-400">Email</span>
            <span className="text-white">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-400">Member since</span>
            <span className="text-white">{joined}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
