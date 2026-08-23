import { formatDistanceToNow, parseISO } from "date-fns";
import { Bell, UserPlus, Heart, MessageCircle, Briefcase, Star } from "lucide-react";

const TYPE_CONFIG = {
  connection_request: { icon: UserPlus, color: "text-forest-dark", bg: "bg-forest/10" },
  connection_accepted: { icon: UserPlus, color: "text-forest-dark", bg: "bg-forest/10" },
  post_like: { icon: Heart, color: "text-red-500", bg: "bg-red-50" },
  post_comment: { icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50" },
  opportunity: { icon: Briefcase, color: "text-gold-dark", bg: "bg-gold/10" },
  milestone: { icon: Star, color: "text-gold-dark", bg: "bg-gold/10" },
};

/**
 * Single notification row.
 * Props: notification { id, type, message, read, link, createdAt }, onClick(id, link)
 */
export default function NotificationItem({ notification, onClick }) {
  const { type, message, read, link, createdAt } = notification;
  const config = TYPE_CONFIG[type] || { icon: Bell, color: "text-ink-soft", bg: "bg-parchment" };
  const Icon = config.icon;

  const time = createdAt
    ? formatDistanceToNow(typeof createdAt === "string" ? parseISO(createdAt) : new Date(createdAt), {
        addSuffix: true,
      })
    : "";

  return (
    <button
      onClick={() => onClick(notification)}
      className={`flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl transition-colors ${
        read ? "bg-surface hover:bg-parchment/60" : "bg-forest/[0.04] hover:bg-forest/[0.08]"
      }`}
      aria-label={message}
    >
      <div
        className={`mt-0.5 shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${config.bg}`}
      >
        <Icon size={15} className={config.color} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${read ? "text-ink-soft" : "text-ink font-medium"}`}>
          {message}
        </p>
        <p className="text-[11px] text-ink-soft mt-0.5">{time}</p>
      </div>
      {!read && (
        <div
          className="mt-2 shrink-0 w-2 h-2 rounded-full bg-forest"
          aria-label="Unread"
        />
      )}
    </button>
  );
}
