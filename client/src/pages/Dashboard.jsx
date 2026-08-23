import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import {
  Users, Briefcase, BookOpen,
  Code2, Award, Target, Plus, ArrowRight,
} from "lucide-react";
import StatCard from "../components/StatCard";
import GrowthRing from "../components/GrowthRing";
import Avatar from "../components/Avatar";
import ProfileCompletion from "../components/ProfileCompletion";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import OpportunityCard from "../components/OpportunityCard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState({ connected: [], pending: [], incoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.listUsers(),
      api.getOpportunities(),
      api.listPosts(),
      api.getConnections(),
    ])
      .then(([users, opps, postList, conn]) => {
        setPeople(users.slice(0, 4));
        setOpportunities(opps.slice(0, 3));
        setPosts(postList.slice(0, 3));
        setConnections(conn);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Skills",
        value: user?.skills?.length ?? 0,
        icon: Code2,
        color: "forest",
        to: "/development",
      },
      {
        label: "Projects",
        value: user?.projects?.length ?? 0,
        icon: Award,
        color: "gold",
        to: "/profile",
      },
      {
        label: "Connections",
        value: connections.connected.length,
        icon: Users,
        color: "walnut",
        to: "/network",
      },
      {
        label: "Certifications",
        value: user?.certifications?.length ?? 0,
        icon: Target,
        color: "forest",
        to: "/profile",
      },
    ],
    [user, connections]
  );

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div className="flex items-start gap-4">
        {user && <GrowthRing user={user} size={56} />}
        <div>
          <h1 className="font-display text-2xl leading-snug">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-ink-soft mt-0.5">
            {user?.headline || "Complete your profile to get started."}
          </p>
        </div>
      </div>

      {/* Profile completion */}
      {user && !user.onboardingComplete && (
        <div className="bg-surface border border-gold/30 rounded-card shadow-card p-5">
          <ProfileCompletion profile={user} />
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface border border-line rounded-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} onClick={() => navigate(s.to)} />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <ActionButton
          label="New post"
          icon={<Plus size={14} />}
          onClick={() => navigate("/feed")}
          primary
        />
        <ActionButton label="Browse opportunities" onClick={() => navigate("/opportunities")} />
        <ActionButton label="Add a goal" onClick={() => navigate("/development")} />
        <ActionButton label="Find resources" onClick={() => navigate("/resources")} />
      </div>

      {/* Open opportunities */}
      <section>
        <SectionHeader
          title="Open Opportunities"
          icon={<Briefcase size={16} />}
          action="See all"
          onAction={() => navigate("/opportunities")}
        />
        {loading ? (
          <Skeleton.Row count={3} />
        ) : opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No opportunities yet"
            description="Check back soon."
          />
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id || opp._id} opportunity={opp} compact />
            ))}
          </div>
        )}
      </section>

      {/* People you may know */}
      <section>
        <SectionHeader
          title="People You May Know"
          icon={<Users size={16} />}
          action="See all"
          onAction={() => navigate("/network")}
        />
        {loading ? (
          <Skeleton.Grid count={4} />
        ) : people.length === 0 ? (
          <EmptyState icon={Users} title="No suggestions yet" description="Connect with classmates to grow your network." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                isConnected={connections.connected.includes(person.id)}
                isPending={connections.pending.includes(person.id)}
                onOpen={() => navigate(`/profile/${person.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent feed posts */}
      {posts.length > 0 && (
        <section>
          <SectionHeader
            title="Recent in Feed"
            icon={<BookOpen size={16} />}
            action="Open feed"
            onAction={() => navigate("/feed")}
          />
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface border border-line rounded-card p-4 cursor-pointer hover:border-forest/30 transition-colors"
                onClick={() => navigate("/feed")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/feed")}
              >
                <p className="text-sm text-ink line-clamp-2">{post.content}</p>
                <p className="text-xs text-ink-soft mt-1.5">
                  {post.likes?.length || 0} appreciation{post.likes?.length !== 1 ? "s" : ""} ·{" "}
                  {post.comments?.length || 0}{" "}
                  {post.comments?.length === 1 ? "reply" : "replies"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title, icon, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-lg flex items-center gap-2 text-ink">
        <span className="text-ink-soft">{icon}</span>
        {title}
      </h2>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs font-medium text-forest-dark hover:underline"
        >
          {action} <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}

function ActionButton({ label, icon, onClick, primary = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs font-medium rounded-full px-4 py-2 transition-colors ${
        primary
          ? "bg-forest text-white hover:bg-forest-dark"
          : "border border-line text-ink-soft hover:text-ink hover:bg-black/[0.03]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PersonCard({ person, isConnected, isPending, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 bg-surface border border-line rounded-card p-3 hover:border-forest/30 transition-colors text-left w-full"
    >
      <Avatar user={person} size={40} />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{person.name}</p>
        <p className="text-xs text-ink-soft truncate">{person.headline}</p>
        {isConnected && (
          <span className="text-[11px] text-forest-dark font-medium">✓ Connected</span>
        )}
        {isPending && !isConnected && (
          <span className="text-[11px] text-ink-soft italic">Request sent</span>
        )}
      </div>
    </button>
  );
}
