import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../context/AuthContext";
import CreatePostBox from "../components/CreatePostBox";
import PostCard from "../components/PostCard";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { Rss } from "lucide-react";

export default function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, dismiss } = useToast();
  const [posts, setPosts] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    const [postList, users] = await Promise.all([
      api.listPosts(),
      api.listUsers({ excludeSelf: false }),
    ]);
    setPosts(postList);
    setUsersById(Object.fromEntries(users.map((u) => [u.id, u])));
  }

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  async function handleCreate({ content, tag }) {
    try {
      await api.createPost({ authorId: user.id, content, tag });
      await loadAll();
      toast("Posted successfully!", "success");
    } catch {
      toast("Failed to create post. Please try again.", "error");
    }
  }

  async function handleToggleLike(postId) {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(user.id)
                ? p.likes.filter((id) => id !== user.id)
                : [...p.likes, user.id],
            }
          : p
      )
    );
    try {
      await api.toggleLike(postId, user.id);
    } catch {
      // Revert on failure
      await loadAll();
    }
  }

  async function handleAddComment(postId, content) {
    try {
      await api.addComment(postId, { authorId: user.id, content });
      await loadAll();
    } catch {
      toast("Failed to post comment.", "error");
    }
  }

  async function handleDeletePost(postId) {
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast("Post deleted", "info");
    } catch {
      toast("Failed to delete post.", "error");
    }
  }

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="font-display text-2xl">Feed</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            What your cohort is building, shipping, and figuring out.
          </p>
        </div>

        <CreatePostBox user={user} onSubmit={handleCreate} />

        {loading ? (
          <Skeleton.Row count={3} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Rss}
            title="Your feed is quiet."
            description="Share what you're working on — be the first in your cohort to post."
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={usersById[post.authorId]}
                authorsById={usersById}
                currentUserId={user.id}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onDeletePost={handleDeletePost}
                onOpenProfile={(id) => navigate(`/profile/${id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
