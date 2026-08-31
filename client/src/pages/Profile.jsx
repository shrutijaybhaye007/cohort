import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import GrowthRing from "../components/GrowthRing";
import ProfileCompletion from "../components/ProfileCompletion";
import SkillBadge from "../components/SkillBadge";
import Skeleton from "../components/Skeleton";
import { Pencil, MapPin, GraduationCap, X, Plus, GitBranch, Link2, Globe, ExternalLink, Award, Trophy, FolderGit2 } from "lucide-react";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function getProfLevel(proficiencies = [], skill) {
  return proficiencies.find((p) => p.skill === skill)?.level || null;
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, refresh } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast, dismiss } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [connections, setConnections] = useState({ connected: [], pending: [], incoming: [] });

  const isSelf = !id || (currentUser && (id === currentUser.id || id === currentUser._id));
  const targetId = id || currentUser?.id || currentUser?._id || "me";

  const loadProfile = useCallback(async () => {
    try {
      const [u, c] = await Promise.all([
        api.getUser(isSelf ? "me" : targetId),
        api.getConnections().catch(() => ({ connected: [], pending: [], incoming: [] })),
      ]);
      setProfile(u || (isSelf ? currentUser : null));
      setConnections(c || { connected: [], pending: [], incoming: [] });
    } catch (err) {
      console.error("Failed to load profile", err);
      if (isSelf && currentUser) {
        setProfile(currentUser);
      } else {
        setProfile(null);
      }
    }
  }, [isSelf, targetId, currentUser]);

  useEffect(() => {
    setLoading(true);
    loadProfile().finally(() => setLoading(false));
  }, [loadProfile]);

  async function handleSave(patch) {
    const updated = await api.updateProfile(currentUser?.id, patch);
    setProfile(updated);
    await refresh();
    setEditing(false);
    toast("Profile saved!", "success");
  }

  async function handleConnect() {
    await api.sendConnectionRequest(targetId);
    const c = await api.getConnections();
    setConnections(c);
    toast("Connection request sent", "success");
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton.Card lines={4} hasAvatar />
        <Skeleton.Card lines={3} />
        <Skeleton.Card lines={4} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-ink-soft">Profile not found.</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-sm text-forest-dark hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const connectionState = isSelf
    ? null
    : connections.connected.includes(targetId)
    ? "connected"
    : connections.pending.includes(targetId)
    ? "pending"
    : "none";


  if (editing) {
    return (
      <>
        <ProfileEditor profile={profile} onCancel={() => setEditing(false)} onSave={handleSave} />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header card */}
        <div className="bg-surface border border-line rounded-card shadow-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <GrowthRing user={profile} size={72} showLabel />
              <div>
                <h1 className="font-display text-2xl leading-tight">{profile.name}</h1>
                <p className="text-sm text-ink-soft mt-0.5">
                  {profile.headline || "No headline yet"}
                </p>
              </div>
            </div>
            {isSelf ? (

              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-ink border border-line rounded-full px-3 py-1.5 shrink-0"
              >
                <Pencil size={13} /> Edit profile
              </button>
            ) : (
              <ConnectButton state={connectionState} onConnect={handleConnect} />
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 pt-4 border-t border-line text-xs text-ink-soft">
            {profile.university && (
              <span className="flex items-center gap-1.5">
                <GraduationCap size={14} /> {profile.university}
              </span>
            )}
            {profile.program && (
              <span className="flex items-center gap-1.5">
                {profile.program} {profile.year ? `· ${profile.year}` : ""}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
          </div>

          {/* Social links */}
          {(profile.links.github || profile.links.linkedin || profile.links.portfolio) && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-line">
              {profile.links.github && (
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
                  aria-label="GitHub profile"
                >
                  <GitBranch size={14} /> GitHub
                </a>
              )}
              {profile.links.linkedin && (
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
                  aria-label="LinkedIn profile"
                >
                  <Link2 size={14} /> LinkedIn
                </a>
              )}
              {profile.links.portfolio && (
                <a
                  href={profile.links.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
                  aria-label="Portfolio"
                >
                  <Globe size={14} /> Portfolio
                </a>
              )}
            </div>
          )}
        </div>

        {/* Profile completion (self only) */}
        {isSelf && (
          <div className="bg-surface border border-line rounded-card shadow-card p-5">
            <ProfileCompletion profile={profile} />
          </div>
        )}

        {/* About */}
        {profile.bio && (
          <section className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-display text-lg mb-2">About</h2>
            <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </section>
        )}

        {/* Skills */}
        {(profile.skills.length > 0) && (
          <section className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-display text-lg mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <SkillBadge
                  key={s}
                  skill={s}
                  level={getProfLevel(profile.skillProficiencies, s)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <section className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <FolderGit2 size={18} className="text-forest" /> Projects
            </h2>
            <div className="space-y-4">
              {profile.projects.map((proj, i) => (
                <ProjectCard key={proj.id || i} project={proj} />
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <section className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <Award size={18} className="text-gold-dark" /> Certifications
            </h2>
            <ul className="space-y-3">
              {profile.certifications.map((cert, i) => (
                <li key={cert.id || i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Award size={15} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {cert.name}
                        </a>
                      ) : (
                        cert.name
                      )}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {cert.issuer}
                      {cert.date && ` · ${cert.date}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {profile.achievements.length > 0 && (
          <section className="bg-surface border border-line rounded-card shadow-card p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-walnut" /> Achievements
            </h2>
            <ul className="space-y-2">
              {profile.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink">
                  <span className="text-gold mt-0.5">âœ¦</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state for self */}
        {isSelf &&
          !profile.bio &&
          !profile.skills.length &&
          !profile.projects.length && (
            <div className="text-center py-12 border border-dashed border-line rounded-card">
              <p className="text-sm text-ink-soft">
                Your profile looks bare. Add a bio, skills, and projects!
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-3 text-sm font-medium text-forest-dark hover:underline"
              >
                Complete your profile
              </button>
            </div>
          )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProjectCard({ project }) {
  return (
    <div className="border border-line rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{project.name}</h3>
        <div className="flex gap-2 shrink-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft hover:text-ink"
              aria-label="GitHub"
            >
              <GitBranch size={14} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft hover:text-ink"
              aria-label="Live demo"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      {project.description && (
        <p className="text-xs text-ink leading-relaxed mt-1.5">{project.description}</p>
      )}
      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-parchment border border-line text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {project.date && (
        <p className="text-[11px] text-ink-soft mt-2">{project.date}</p>
      )}
    </div>
  );
}

function ConnectButton({ state, onConnect }) {
  if (state === "connected") {
    return (
      <span className="text-xs font-medium text-forest-dark bg-forest/10 rounded-full px-3 py-1.5 shrink-0">
        Connected
      </span>
    );
  }
  if (state === "pending") {
    return <span className="text-xs text-ink-soft italic shrink-0">Request sent</span>;
  }
  return (
    <button
      onClick={onConnect}
      className="text-xs font-medium text-white bg-forest hover:bg-forest-dark rounded-full px-4 py-1.5 shrink-0 transition-colors"
    >
      Connect
    </button>
  );
}

// â”€â”€â”€ Profile Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProfileEditor({ profile, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: profile.name || "",
    headline: profile.headline || "",
    university: profile.university || "",
    program: profile.program || "",
    year: profile.year || "",
    location: profile.location || "",
    bio: profile.bio || "",
    skills: [...(profile.skills || [])],
    skillProficiencies: [...(profile.skillProficiencies || [])],
    projects: [...(profile.projects || [])],
    certifications: [...(profile.certifications || [])],
    achievements: [...(profile.achievements || [])],
    links: { github: "", linkedin: "", portfolio: "", ...(profile.links || {}) },
  });

  const [skillDraft, setSkillDraft] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [activeTab, setActiveTab] = useState("basic");

  // New project/cert/achievement drafts
  const [projDraft, setProjDraft] = useState({
    name: "", description: "", tech: [], techDraft: "", githubUrl: "", liveUrl: "", date: "",
  });
  const [certDraft, setCertDraft] = useState({ name: "", issuer: "", date: "", url: "" });
  const [achDraft, setAchDraft] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function setLink(key) {
    return (e) => setForm((f) => ({ ...f, links: { ...f.links, [key]: e.target.value } }));
  }

  function addSkill(e) {
    e.preventDefault();
    const s = skillDraft.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({
        ...f,
        skills: [...f.skills, s],
        skillProficiencies: [...f.skillProficiencies, { skill: s, level: skillLevel }],
      }));
    }
    setSkillDraft("");
  }

  function removeSkill(s) {
    setForm((f) => ({
      ...f,
      skills: f.skills.filter((x) => x !== s),
      skillProficiencies: f.skillProficiencies.filter((p) => p.skill !== s),
    }));
  }

  function addProject(e) {
    e.preventDefault();
    if (!projDraft.name.trim()) return;
    const { techDraft, ...rest } = projDraft;
    setForm((f) => ({
      ...f,
      projects: [...f.projects, { ...rest, id: `proj-${Date.now()}`, tech: rest.tech }],
    }));
    setProjDraft({ name: "", description: "", tech: [], techDraft: "", githubUrl: "", liveUrl: "", date: "" });
  }

  function removeProject(idx) {
    setForm((f) => ({ ...f, projects: f.projects.filter((_, i) => i !== idx) }));
  }

  function addCert(e) {
    e.preventDefault();
    if (!certDraft.name.trim()) return;
    setForm((f) => ({
      ...f,
      certifications: [...f.certifications, { ...certDraft, id: `cert-${Date.now()}` }],
    }));
    setCertDraft({ name: "", issuer: "", date: "", url: "" });
  }

  function removeCert(idx) {
    setForm((f) => ({ ...f, certifications: f.certifications.filter((_, i) => i !== idx) }));
  }

  function addAchievement(e) {
    e.preventDefault();
    const a = achDraft.trim();
    if (a) setForm((f) => ({ ...f, achievements: [...f.achievements, a] }));
    setAchDraft("");
  }

  function removeAchievement(idx) {
    setForm((f) => ({ ...f, achievements: f.achievements.filter((_, i) => i !== idx) }));
  }

  const tabs = [
    { key: "basic", label: "Basic" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "certs", label: "Certs & Awards" },
    { key: "links", label: "Links" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Edit profile</h1>
        <button type="button" onClick={onCancel} className="text-sm text-ink-soft hover:text-ink">
          Cancel
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-0.5 border-b border-line overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`shrink-0 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.key
                ? "border-forest text-forest-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-surface border border-line rounded-card shadow-card p-6">
        {activeTab === "basic" && (
          <div className="space-y-4">
            <Field label="Full name" value={form.name} onChange={set("name")} />
            <Field
              label="Headline"
              value={form.headline}
              onChange={set("headline")}
              placeholder="e.g. CS Junior · Building accessible tools"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="University" value={form.university} onChange={set("university")} />
              <Field label="Year" value={form.year} onChange={set("year")} placeholder="e.g. 3rd Year" />
            </div>
            <Field label="Program" value={form.program} onChange={set("program")} />
            <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Pune, MH" />
            <label className="block">
              <span className="text-xs font-medium text-ink-soft">Bio</span>
              <textarea
                value={form.bio}
                onChange={set("bio")}
                rows={4}
                placeholder="What are you working on What are you looking to learn"
                className="mt-1.5 w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40 resize-none"
              />
            </label>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s) => (
                <SkillBadge key={s} skill={s} onRemove={removeSkill} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill(e)}
                placeholder="Add a skill..."
                className="flex-1 min-w-[140px] border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none"
              >
                {PROFICIENCY_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSkill}
                className="border border-line rounded-lg px-3 py-2 text-ink-soft hover:text-ink"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-5">
            {/* Existing projects */}
            {form.projects.map((p, i) => (
              <div key={i} className="border border-line rounded-xl p-4 relative">
                <button
                  type="button"
                  onClick={() => removeProject(i)}
                  className="absolute top-3 right-3 text-ink-soft hover:text-red-500"
                >
                  <X size={14} />
                </button>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-ink-soft">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-parchment border border-line">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Add project form */}
            <div className="border border-dashed border-line rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-ink-soft">Add a project</p>
              <Field
                label="Project name *"
                value={projDraft.name}
                onChange={(e) => setProjDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Campus Network App"
              />
              <label className="block">
                <span className="text-xs font-medium text-ink-soft">Description</span>
                <textarea
                  value={projDraft.description}
                  onChange={(e) => setProjDraft((d) => ({ ...d, description: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40 resize-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="GitHub URL"
                  value={projDraft.githubUrl}
                  onChange={(e) => setProjDraft((d) => ({ ...d, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                />
                <Field
                  label="Live URL"
                  value={projDraft.liveUrl}
                  onChange={(e) => setProjDraft((d) => ({ ...d, liveUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={projDraft.techDraft}
                  onChange={(e) => setProjDraft((d) => ({ ...d, techDraft: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const t = projDraft.techDraft.trim();
                      if (t) setProjDraft((d) => ({ ...d, tech: [...d.tech, t], techDraft: "" }));
                    }
                  }}
                  placeholder="Add tech (press Enter)..."
                  className="flex-1 border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none"
                />
              </div>
              {projDraft.tech.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {projDraft.tech.map((t, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-parchment border border-line text-ink-soft flex items-center gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => setProjDraft((d) => ({ ...d, tech: d.tech.filter((_, j) => j !== i) }))}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={addProject}
                disabled={!projDraft.name.trim()}
                className="flex items-center gap-1.5 text-xs font-medium bg-forest text-white rounded-full px-4 py-1.5 hover:bg-forest-dark disabled:opacity-50"
              >
                <Plus size={13} /> Add project
              </button>
            </div>
          </div>
        )}

        {activeTab === "certs" && (
          <div className="space-y-5">
            {/* Certifications */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Certifications</h3>
              {form.certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-3 mb-2 p-3 border border-line rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-ink-soft">{c.issuer} {c.date && `· ${c.date}`}</p>
                  </div>
                  <button type="button" onClick={() => removeCert(i)} className="text-ink-soft hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="border border-dashed border-line rounded-xl p-4 space-y-3">
                <Field label="Certification name *" value={certDraft.name} onChange={(e) => setCertDraft((d) => ({ ...d, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Issuer" value={certDraft.issuer} onChange={(e) => setCertDraft((d) => ({ ...d, issuer: e.target.value }))} placeholder="e.g. Coursera" />
                  <Field label="Date" value={certDraft.date} onChange={(e) => setCertDraft((d) => ({ ...d, date: e.target.value }))} placeholder="e.g. Jan 2026" />
                </div>
                <Field label="URL" value={certDraft.url} onChange={(e) => setCertDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://..." />
                <button type="button" onClick={addCert} disabled={!certDraft.name.trim()} className="flex items-center gap-1.5 text-xs font-medium bg-forest text-white rounded-full px-4 py-1.5 hover:bg-forest-dark disabled:opacity-50">
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-sm font-semibold text-ink mb-3">Achievements</h3>
              {form.achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="flex-1 text-sm text-ink bg-parchment border border-line rounded-lg px-3 py-2">{a}</span>
                  <button type="button" onClick={() => removeAchievement(i)} className="text-ink-soft hover:text-red-500"><X size={14} /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={achDraft}
                  onChange={(e) => setAchDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAchievement(e)}
                  placeholder="e.g. 1st place at departmental hackathon"
                  className="flex-1 border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
                />
                <button type="button" onClick={addAchievement} className="border border-line rounded-lg px-3 text-ink-soft hover:text-ink"><Plus size={16} /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-4">
            <p className="text-xs text-ink-soft">Add your professional links so peers can find your work.</p>
            <label className="flex items-center gap-3">
              <GitBranch size={18} className="text-ink-soft shrink-0" />
              <input
                value={form.links.github}
                onChange={setLink("github")}
                placeholder="https://github.com/username"
                className="flex-1 border border-line rounded-lg px-3 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </label>
            <label className="flex items-center gap-3">
              <Link2 size={18} className="text-ink-soft shrink-0" />
              <input
                value={form.links.linkedin}
                onChange={setLink("linkedin")}
                placeholder="https://linkedin.com/in/username"
                className="flex-1 border border-line rounded-lg px-3 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </label>
            <label className="flex items-center gap-3">
              <Globe size={18} className="text-ink-soft shrink-0" />
              <input
                value={form.links.portfolio}
                onChange={setLink("portfolio")}
                placeholder="https://yourportfolio.com"
                className="flex-1 border border-line rounded-lg px-3 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
              />
            </label>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-forest text-white text-sm font-medium rounded-full px-6 py-2.5 hover:bg-forest-dark transition-colors"
        >
          Save profile
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-ink-soft hover:text-ink px-3"
        >
          Cancel
        </button>
      </div>
    </form>
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
