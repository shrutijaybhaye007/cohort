import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Heart, MessageCircle, Trash2, MoreHorizontal } from "lucide-react";
import Avatar from "./Avatar";

const tagStyles = {
  Milestone: "bg-gold/15 text-gold-dark",
  Research: "bg-forest/10 text-forest-dark",
  Mentorship: "bg-walnut/10 text-walnut",
  Project: "bg-forest/10 text-forest-dark",
  Update: "bg-black/5 text-ink-soft",
};

export default function PostCard({
  post,
  author,
  authorsById,
  currentUserId,
  onToggleLike,
  onAddComment,
  onDeletePost,
  onOpenProfile,
}) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [draft, setDraft] = useState("");
  const liked = post.likes.includes(currentUserId);
  const isOwner = post.authorId === currentUserId;

  function submitComment(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddComment(post.id, draft.trim());
    setDraft("");
  }

  function handleDelete() {
    setShowMenu(false);
    onDeletePost?.(post.id);
  }

  if (!author) return null;

  return (
    <article className="bg-surface border border-line rounded-card shadow-card p-5">
      <div className="flex gap-3">
        <button onClick={() => onOpenProfile(author.id)} className="shrink-0">
          <Avatar user={author} size={44} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <button
              onClick={() => onOpenProfile(author.id)}
              className="font-medium text-sm hover:underline truncate text-left"
            >
              {author.name}
            </button>
            <div className="flex items-center gap-1 shrink-0">
              <time className="font-mono text-[11px] text-ink-soft">
                {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
              </time>
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((s) => !s)}
                    className="p-1 text-ink-soft hover:text-ink rounded-lg hover:bg-black/[0.04]"
                    aria-label="Post options"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {showMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                        aria-hidden="true"
                      />
                      <div className="absolute right-0 mt-1 z-20 bg-surface border border-line rounded-xl shadow-card overflow-hidden min-w-[130px]">
                        <button
                          onClick={handleDelete}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} /> Delete post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-ink-soft truncate">{author.headline}</p>

          <p className="mt-3 text-[15px] leading-relaxed text-ink whitespace-pre-line">
            {post.content}
          </p>

          {post.tag && (
            <span
              className={`inline-block mt-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                tagStyles[post.tag] || tagStyles.Update
              }`}
            >
              {post.tag}
            </span>
          )}

          <div className="mt-4 flex items-center gap-4 border-t border-line pt-3">
            <button
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                liked ? "text-gold-dark" : "text-ink-soft hover:text-ink"
              }`}
              aria-pressed={liked}
            >
              <Heart size={16} fill={liked ? "#C9A227" : "none"} />
              {post.likes.length > 0 ? post.likes.length : ""}{" "}
              {liked ? "Appreciated" : "Appreciate"}
            </button>
            <button
              onClick={() => setShowComments((s) => !s)}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink transition-colors"
            >
              <MessageCircle size={16} />
              {post.comments.length > 0 ? post.comments.length : ""}{" "}
              {post.comments.length === 1 ? "Reply" : "Replies"}
            </button>
          </div>

          {showComments && (
            <div className="mt-3 pt-3 border-t border-line space-y-3">
              {post.comments.map((c) => (
                <CommentRow
                  key={c.id}
                  comment={c}
                  author={authorsById?.[c.authorId]}
                />
              ))}
              <form onSubmit={submitComment} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a reply…"
                  className="flex-1 text-sm bg-parchment border border-line rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
                <button
                  type="submit"
                  className="text-xs font-medium text-forest-dark px-3 disabled:opacity-40"
                  disabled={!draft.trim()}
                >
                  Reply
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CommentRow({ comment, author }) {
  return (
    <div className="flex gap-2.5">
      <Avatar user={author} size={28} className="mt-0.5" />
      <div className="bg-parchment rounded-2xl px-3 py-2 text-sm flex-1">
        {author && <p className="font-medium text-xs">{author.name}</p>}
        <p className="text-ink">{comment.content}</p>
      </div>
    </div>
  );
}
