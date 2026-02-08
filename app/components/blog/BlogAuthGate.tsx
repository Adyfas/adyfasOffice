import { useState } from "react";
import { useNavigate } from "react-router";
import { useBlogAuth } from "~/store/blogAuth";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function BlogAuthGate({ children, redirectTo = "/blog" }: Props) {
  const isAuthenticated = useBlogAuth((s) => s.isAuthenticated);
  const login = useBlogAuth((s) => s.login);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(password)) {
      setPassword("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    useBlogAuth.getState().logout();
    navigate(redirectTo);
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs p-6 rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-2">Owner Access</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter password to access this page.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
