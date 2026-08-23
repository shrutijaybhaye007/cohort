import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import GoalCard from "../components/GoalCard";
import SkillBadge from "../components/SkillBadge";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { Target, Plus, X, Code2, ChevronDown } from "lucide-react";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const PROF_BAR = {
  Beginner: { width: "w-1/3", color: "bg-green-500" },
  Intermediate: { width: "w-2/3", color: "bg-gold" },
  Advanced: { width: "w-full", color: "bg-forest" },
};

export default function Development() {
  const { user, refresh } = useAuth();
  const { toasts, toast, dismiss } = useToast();

  // Goals
  const {
    data: goals,
    loading: goalsLoading,
    refetch: refetchGoals,
  } = useFetch(() => api.getGoals(), []);

  const [newGoal, setNewGoal] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);

  async function handleAddGoal(e) {
    e.preventDefault();
    const t = newGoal.trim();
    if (!t) return;
    setAddingGoal(true);
    try {
      await api.addGoal({ title: t });
      setNewGoal("");
      await refetchGoals();
      toast("Goal added!", "success");
    } finally {
      setAddingGoal(false);
    }
  }

  async function handleStatusChange(id, status) {
    await api.updateGoal(id, { status });
    await refetchGoals();
  }

  async function handleDeleteGoal(id) {
    await api.deleteGoal(id);
    await refetchGoals();
    toast("Goal removed", "info");
  }

  // Skills
  const skills = user.skills || [];
  const proficiencies = user.skillProficiencies || [];
  const [skillDraft, setSkillDraft] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Beginner");
  const [savingSkills, setSavingSkills] = useState(false);

  function getProfLevel(skill) {
    const match = proficiencies.find((p) => p.skill === skill);
    return match?.level || "Beginner";
  }

  async function handleAddSkill(e) {
    e.preventDefault();
    const s = skillDraft.trim();
    if (!s || skills.includes(s)) return;
    setSavingSkills(true);
    try {
      const newSkills = [...skills, s];
      const newProfs = [...proficiencies, { skill: s, level: newSkillLevel }];
      await api.updateProfile(user.id, { skills: newSkills, skillProficiencies: newProfs });
      await refresh();
      setSkillDraft("");
      toast(`${s} added`, "success");
    } finally {
      setSavingSkills(false);
    }
  }

  async function handleRemoveSkill(skill) {
    const newSkills = skills.filter((s) => s !== skill);
    const newProfs = proficiencies.filter((p) => p.skill !== skill);
    await api.updateProfile(user.id, { skills: newSkills, skillProficiencies: newProfs });
    await refresh();
    toast(`${skill} removed`, "info");
  }

  async function handleLevelChange(skill, level) {
    const newProfs = proficiencies.map((p) =>
      p.skill === skill ? { ...p, level } : p
    );
    if (!newProfs.find((p) => p.skill === skill)) {
      newProfs.push({ skill, level });
    }
    await api.updateProfile(user.id, { skillProficiencies: newProfs });
    await refresh();
  }

  // Stats
  const completed = (goals || []).filter((g) => g.status === "completed").length;
  const total = (goals || []).length;
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;


  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl">Development</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            Track your skills and professional goals in one place.
          </p>
        </div>

        {/* Goal progress summary */}
        {total > 0 && (
          <div className="bg-surface border border-line rounded-card shadow-card p-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-ink">Goal progress</span>
              <span className="text-ink-soft">
                {completed}/{total} complete
              </span>
            </div>
            <div className="h-2.5 bg-black/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-forest rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-ink-soft mt-1.5">{progressPct}% achieved</p>
          </div>
        )}

        {/* Goals section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg flex items-center gap-2">
              <Target size={18} className="text-forest" /> Goals
            </h2>
          </div>

          {/* Add goal */}
          <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
            <input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add a new goal..."
              className="flex-1 border border-line rounded-lg px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40"
            />
            <button
              type="submit"
              disabled={addingGoal || !newGoal.trim()}
              className="flex items-center gap-1.5 bg-forest text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-forest-dark transition-colors disabled:opacity-50"
            >
              <Plus size={15} /> Add
            </button>
          </form>

          {goalsLoading ? (
            <Skeleton.Row count={3} />
          ) : !goals || goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals yet"
              description="Set a professional goal to start tracking your progress."
            />
          ) : (
            <div className="space-y-2">
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </section>

        {/* Skills section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg flex items-center gap-2">
              <Code2 size={18} className="text-forest" /> Skills
            </h2>
          </div>

          {/* Add skill form */}
          <form onSubmit={handleAddSkill} className="flex flex-wrap gap-2 mb-4">
            <input
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              placeholder="Skill name..."
              className="flex-1 min-w-[140px] border border-line rounded-lg px-3.5 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="border border-line rounded-lg px-3 py-2.5 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-forest/40"
            >
              {PROFICIENCY_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={savingSkills || !skillDraft.trim()}
              className="flex items-center gap-1.5 bg-forest text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-forest-dark transition-colors disabled:opacity-50"
            >
              <Plus size={15} /> Add
            </button>
          </form>

          {skills.length === 0 ? (
            <EmptyState
              icon={Code2}
              title="No skills added"
              description="Add your first skill to start building your professional profile."
            />
          ) : (

            <div className="space-y-2">
              {skills.map((skill) => {
                const level = getProfLevel(skill);
                const bar = PROF_BAR[level];
                return (
                  <div
                    key={skill}
                    className="bg-surface border border-line rounded-card shadow-card px-4 py-3 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-medium text-ink">{skill}</span>
                      </div>
                      <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${bar.color} ${bar.width}`}
                        />
                      </div>
                    </div>
                    <select
                      value={level}
                      onChange={(e) => handleLevelChange(skill, e.target.value)}
                      className="text-xs border border-line rounded-lg px-2 py-1 bg-parchment text-ink-soft focus:outline-none"
                      aria-label={`${skill} proficiency`}
                    >
                      {PROFICIENCY_LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-ink-soft hover:text-red-500 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
