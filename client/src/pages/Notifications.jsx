import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import NotificationItem from "../components/NotificationItem";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { Bell, CheckCheck } from "lucide-react";

export default function Notifications() {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  async function handleClick(notification) {
    if (!notification.read) {
      await markRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Notifications</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink border border-line rounded-full px-3 py-1.5"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton.Row count={5} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When someone connects with you, likes your post, or when new opportunities are added, you'll see them here."
        />
      ) : (
        <div className="bg-surface border border-line rounded-card shadow-card overflow-hidden divide-y divide-line">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={handleClick} />
          ))}
        </div>
      )}
    </div>
  );
}
