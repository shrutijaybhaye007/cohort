import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/feed");
    } catch (err) {
      setError("Couldn't sign you in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Pick up where your cohort left off."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Campus email" type="email" value={email} onChange={setEmail} placeholder="you@university.edu" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-white font-medium text-sm rounded-full py-2.5 hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-xs text-ink-soft text-center">
          Demo mode: any email and password works — no account needed.
        </p>
      </form>
      <p className="mt-6 text-sm text-ink-soft text-center">
        New here?{" "}
        <Link to="/register" className="text-forest-dark font-medium hover:underline">
          Create your profile
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({ label, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </label>
  );
}
