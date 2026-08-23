import { useState } from "react";
import Avatar from "./Avatar";

const TAGS = ["Update", "Milestone", "Research", "Project", "Mentorship"];

export default function CreatePostBox({ user, onSubmit }) {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Update");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit({ content: content.trim(), tag });
    setContent("");
    setTag("Update");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-card shadow-card p-5">
      <div className="flex gap-3">
        <Avatar user={user} size={40} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you working on this week?"
          rows={2}
          className="flex-1 resize-none text-sm bg-transparent placeholder:text-ink-soft/70 focus:outline-none leading-relaxed"
        />
      </div>
      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {TAGS.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTag(t)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                tag === t ? "bg-forest text-white" : "bg-parchment text-ink-soft hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 bg-forest text-white text-sm font-medium px-4 py-1.5 rounded-full disabled:opacity-40 hover:bg-forest-dark transition-colors"
        >
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
