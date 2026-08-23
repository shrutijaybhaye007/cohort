import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", university: "", program: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.university) {
      setError("Add your name and university to continue.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError("Something went wrong creating your profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Your professional record shouldn't end at graduation."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" value={form.name} onChange={set("name")} placeholder="Ananya Sharma" />
        <Field label="Campus email" type="email" value={form.email} onChange={set("email")} placeholder="you@university.edu" />
        <Field label="University" value={form.university} onChange={set("university")} placeholder="Shivaji University" />
        <Field label="Program" value={form.program} onChange={set("program")} placeholder="B.Tech Computer Science" />
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-white font-medium text-sm rounded-full py-2.5 hover:bg-forest-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating profile…" : "Create profile"}
        </button>
      </form>
      <p className="mt-6 text-sm text-ink-soft text-center">
        Already on Cohort?{" "}
        <Link to="/login" className="text-forest-dark font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </label>
  );
}
