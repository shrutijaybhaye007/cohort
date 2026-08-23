import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import SearchInput from "../components/SearchInput";
import Skeleton from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { useDebounce } from "../hooks/useDebounce";
import { UserPlus, Check, X, Users } from "lucide-react";

const TABS = [
  { key: "suggested", label: "Suggested" },
  { key: "incoming", label: "Requests" },
  { key: "connected", label: "Connections" },
];

export default function Network() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState({ connected: [], pending: [], incoming: [] });
  const [tab, setTab] = useState("suggested");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  async function loadAll() {
    const [userList, conn] = await Promise.all([api.listUsers(), api.getConnections()]);
    setUsers(userList);
    setConnections(conn);
  }

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  async function handleConnect(id) {
    setConnections((c) => ({ ...c, pending: [...c.pending, id] }));
    await api.sendConnectionRequest(id);
  }

  async function handleAccept(id) {
    await api.acceptConnectionRequest(id);
    await loadAll();
  }

  async function handleIgnore(id) {
    await api.ignoreConnectionRequest(id);
    await loadAll();
  }

  const byId = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );

  const suggested = useMemo(
    () =>
      users.filter(
        (u) =>
          !connections.connected.includes(u.id) &&
          !connections.pending.includes(u.id) &&
          !connections.incoming.includes(u.id)
      ),
    [users, connections]
  );

  const lists = {
    suggested,
    incoming: connections.incoming.map((id) => byId[id]).filter(Boolean),
    connected: connections.connected.map((id) => byId[id]).filter(Boolean),
  };

  // Apply search filter
  const filteredList = useMemo(() => {
    const list = lists[tab] || [];
    if (!debouncedSearch) return list;
    const re = new RegExp(debouncedSearch, "i");
    return list.filter(
      (p) =>
        re.test(p.name) ||
        re.test(p.headline || "") ||
        re.test(p.university || "") ||
        (p.skills || []).some((s) => re.test(s))
    );
  }, [lists, tab, debouncedSearch]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Network</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Peers, alumni, and faculty mentors from your program.
        </p>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by name, skill, or university..."
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? "border-forest text-forest-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
            {t.key === "incoming" && connections.incoming.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold text-[10px] text-white font-bold">
                {connections.incoming.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton.Grid count={4} />
      ) : filteredList.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : tab === "suggested"
              ? "No new suggestions right now."
              : tab === "incoming"
              ? "No pending requests — you're all caught up."
              : "You haven't connected with anyone yet. Start with Suggested."
          }
          description={debouncedSearch ? "Try a different name or skill." : undefined}
          action={debouncedSearch ? "Clear search" : tab !== "suggested" ? "See suggested" : undefined}
          onAction={() => {
            if (debouncedSearch) { setSearch(""); return; }
            setTab("suggested");
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredList.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              tab={tab}
              onOpen={() => navigate(`/profile/${person.id}`)}
              onConnect={() => handleConnect(person.id)}
              onAccept={() => handleAccept(person.id)}
              onIgnore={() => handleIgnore(person.id)}
              pending={connections.pending.includes(person.id)}
            />
          ))}
        </div>
      )}
    </div>

  );
}

function PersonCard({ person, tab, onOpen, onConnect, onAccept, onIgnore, pending }) {
  return (
    <div className="bg-surface border border-line rounded-card shadow-card p-4 flex gap-3 hover:border-forest/30 transition-colors">
      <button onClick={onOpen} className="shrink-0" aria-label={`View ${person.name}'s profile`}>
        <Avatar user={person} size={44} />
      </button>
      <div className="min-w-0 flex-1">
        <button
          onClick={onOpen}
          className="font-medium text-sm hover:underline text-left block truncate w-full"
        >
          {person.name}
        </button>
        <p className="text-xs text-ink-soft line-clamp-2 mt-0.5">{person.headline}</p>
        {person.university && (
          <p className="text-[11px] text-ink-soft/70 mt-0.5 truncate">{person.university}</p>
        )}

        {/* Skills preview */}
        {person.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {person.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-parchment border border-line text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2.5">
          {tab === "suggested" &&
            (pending ? (
              <span className="text-xs text-ink-soft italic">Request sent</span>
            ) : (
              <button
                onClick={onConnect}
                className="flex items-center gap-1.5 text-xs font-medium text-forest-dark bg-forest/10 hover:bg-forest/15 rounded-full px-3 py-1.5 transition-colors"
              >
                <UserPlus size={13} /> Connect
              </button>
            ))}
          {tab === "incoming" && (
            <div className="flex gap-2">
              <button
                onClick={onAccept}
                className="flex items-center gap-1 text-xs font-medium text-white bg-forest hover:bg-forest-dark rounded-full px-3 py-1.5 transition-colors"
              >
                <Check size={13} /> Accept
              </button>
              <button
                onClick={onIgnore}
                className="flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink bg-black/5 rounded-full px-3 py-1.5 transition-colors"
              >
                <X size={13} /> Ignore
              </button>
            </div>
          )}
          {tab === "connected" && (
            <span className="text-xs text-forest-dark font-medium">âœ“ Connected</span>
          )}
        </div>
      </div>
    </div>
  );
}
