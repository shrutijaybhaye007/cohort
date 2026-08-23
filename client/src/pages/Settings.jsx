import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { User, AlertTriangle } from "lucide-react";

const IS_MOCK_MODE = import.meta.env.VITE_USE_REAL_API !== "true";

export default function Settings() {
  const { user, refresh, logout } = useAuth();
  const { toasts, toast, dismiss } = useToast();
  const [saving, setSaving] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    location: user?.location || "",
  });

  function setField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast("Name cannot be empty.", "error");
      return;
    }
    setSaving(true);
    try {
      await api.updateProfile(user?.id, form);
      await refresh();
      toast("Profile updated successfully!", "success");
    } catch {
      toast("Failed to save changes. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetDemo() {
    if (!IS_MOCK_MODE) {
      toast("Reset demo data is only available in demo/offline mode.", "error");
      setShowDanger(false);
      return;
    }
    setConfirming(false);
    const result = await api.resetDemoData();
    if (result === false) {
      toast("Not available in this mode.", "info");
      return;
    }
    toast("Demo data reset. Logging you out...", "info");
    setTimeout(() => logout(), 1500);
  }

  return (
    <>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="font-display text-2xl">Settings</h1>
          <p className="text-sm text-ink-soft mt-0.5">Manage your account and preferences.</p>
        </div>

        {/* Profile section */}
        <section className="bg-surface border border-line rounded-card shadow-card p-6">
          <h2 className="font-medium text-sm text-ink mb-4 flex items-center gap-2">
            <User size={15} className="text-ink-soft" /> Profile Details
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Field label="Full name *" value={form.name} onChange={setField("name")} placeholder="Your name" />
            <Field
              label="Headline"
              value={form.headline}
              onChange={setField("headline")}
              placeholder="e.g. CS Junior · Building ML tools"
            />
            <Field
              label="Location"
              value={form.location}
              onChange={setField("location")}
              placeholder="e.g. Pune, Maharashtra"
            />

            <div className="text-xs text-ink-soft bg-parchment border border-line rounded-lg p-3">
              <strong>Email:</strong> {user?.email || "—"}{" "}
              <span className="italic">(cannot be changed here)</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-forest text-white text-sm font-medium rounded-full px-5 py-2 hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </section>

        {/* Avatar color */}
        <section className="bg-surface border border-line rounded-card shadow-card p-6">
          <h2 className="font-medium text-sm text-ink mb-4 flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border border-line" style={{ background: user?.avatarColor }} />
            Avatar Colour
          </h2>
          <div className="flex gap-3 flex-wrap">
            {["#2F5233", "#9C7D1B", "#6B4F3B", "#4A7052", "#C9A227", "#1B2420"].map((color) => (
              <button
                key={color}
                onClick={async () => {
                  try {
                    await api.updateProfile(user?.id, { avatarColor: color });
                    await refresh();
                    toast("Avatar colour updated", "success");
                  } catch {
                    toast("Failed to update avatar colour", "error");
                  }
                }}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                  user?.avatarColor === color ? "border-ink scale-110" : "border-transparent"
                }`}
                style={{ background: color }}
                aria-label={`Set avatar colour ${color}`}
              />
            ))}
          </div>
        </section>

        {/* Danger zone — only shown in mock/demo mode */}
        {IS_MOCK_MODE && (
          <section className="border border-red-200 rounded-card p-6">
            <button
              onClick={() => setShowDanger((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline w-full text-left"
            >
              <AlertTriangle size={15} />
              Danger Zone
              <span className="ml-auto text-xs text-ink-soft">{showDanger ? "Hide" : "Show"}</span>
            </button>

            {showDanger && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-ink-soft leading-relaxed">
                  <strong>Demo mode only.</strong> This clears all localStorage data and restores
                  the original seed data. Use this to reset the demo to its initial state.
                  This cannot be undone.
                </p>

                {!confirming ? (
                  <button
                    onClick={() => setConfirming(true)}
                    className="text-sm font-medium text-red-600 border border-red-300 rounded-full px-4 py-2 hover:bg-red-50 transition-colors"
                  >
                    Reset demo data
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-red-600 font-medium">Are you sure?</p>
                    <button
                      onClick={handleResetDemo}
                      className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full px-4 py-2 transition-colors"
                    >
                      Yes, reset
                    </button>
                    <button
                      onClick={() => setConfirming(false)}
                      className="text-sm text-ink-soft hover:text-ink px-3 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </label>
  );
}
