import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Monitor, Database,
  Palette, Shield, Brain, Briefcase, MessageSquare, Users,
} from "lucide-react";

const INTERESTS = [
  { label: "Web Development", icon: Monitor },
  { label: "Data Science", icon: Database },
  { label: "UI/UX", icon: Palette },
  { label: "Cybersecurity", icon: Shield },
  { label: "AI/ML", icon: Brain },
  { label: "Business", icon: Briefcase },
  { label: "Communication", icon: MessageSquare },
  { label: "Leadership", icon: Users },
];

const POPULAR_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "SQL",
  "Figma", "Java", "C++", "Machine Learning", "Git",
  "Communication", "Leadership",
];

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [education, setEducation] = useState({
    university: user.university || "",
    program: user.program || "",
    year: user.year || "",
    location: user.location || "",
  });
  const [goalTitle, setGoalTitle] = useState("");
  const [goals, setGoals] = useState([]);

  function toggleInterest(label) {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );

  }

  function toggleSkill(s) {
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function addCustomSkill(e) {
    e.preventDefault();
    const s = skillDraft.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillDraft("");
  }

  function addGoal(e) {
    e.preventDefault();
    const t = goalTitle.trim();
    if (t && !goals.includes(t)) setGoals((prev) => [...prev, t]);
    setGoalTitle("");
  }

  async function handleFinish() {
    setSaving(true);
    try {
      const patch = {
        interests,
        skills,
        university: education.university,
        program: education.program,
        year: education.year,
        location: education.location,
        onboardingComplete: true,
      };
      await api.updateProfile(user.id, patch);
      // Add goals
      for (const g of goals) {
        await api.addGoal({ title: g });
      }
      await refresh();
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  const stepContent = {
    1: <StepWelcome name={user.name} />,
    2: (
      <StepInterests
        interests={interests}
        onToggle={toggleInterest}
      />
    ),
    3: (
      <StepSkills
        skills={skills}
        draft={skillDraft}
        onToggle={toggleSkill}
        onDraftChange={setSkillDraft}
        onAdd={addCustomSkill}
      />
    ),
    4: (
      <StepEducation
        values={education}
        onChange={(key) => (e) =>
          setEducation((prev) => ({ ...prev, [key]: e.target.value }))
        }
      />
    ),
    5: (
      <StepGoals
        goals={goals}
        draft={goalTitle}
        onDraftChange={setGoalTitle}
        onAdd={addGoal}
        onRemove={(g) => setGoals((prev) => prev.filter((x) => x !== g))}
      />
    ),
    6: (
      <StepComplete
        interests={interests}
        skills={skills}
        goals={goals}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-2">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-black/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-forest rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-line rounded-card shadow-card p-8 min-h-[400px] flex flex-col">
          <div className="flex-1">{stepContent[step]}</div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-line">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 bg-forest text-white text-sm font-medium rounded-full px-5 py-2 hover:bg-forest-dark transition-colors"
              >
                {step === 1 ? "Let's go" : "Continue"} <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center gap-2 bg-forest text-white text-sm font-medium rounded-full px-5 py-2 hover:bg-forest-dark transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : "Go to Dashboard"} <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Step sub-components ---- */

function StepWelcome({ name }) {
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-4">ðŸ‘‹</div>
      <h1 className="font-display text-2xl">Welcome to Cohort, {name.split(" ")[0]}!</h1>
      <p className="text-sm text-ink-soft mt-3 leading-relaxed max-w-xs mx-auto">
        Let's take 2 minutes to set up your professional profile so you can start networking,
        discovering opportunities, and tracking your growth.
      </p>
    </div>
  );
}

function StepInterests({ interests, onToggle }) {
  return (
    <>
      <h2 className="font-display text-xl mb-1">What are you interested in</h2>
      <p className="text-sm text-ink-soft mb-5">
        Choose your areas of focus. We'll personalise your experience.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {INTERESTS.map(({ label, icon: Icon }) => {
          const active = interests.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                active
                   ? "border-forest bg-forest/10 text-forest-dark"
                  : "border-line bg-parchment text-ink-soft hover:border-forest/40"
              }`}

            >
              <Icon size={16} />
              {label}
              {active && <CheckCircle2 size={14} className="ml-auto text-forest" />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StepSkills({ skills, draft, onToggle, onDraftChange, onAdd }) {
  return (
    <>
      <h2 className="font-display text-xl mb-1">What skills do you have</h2>
      <p className="text-sm text-ink-soft mb-5">
        Select skills you've used or are learning. You can edit these later.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {POPULAR_SKILLS.map((s) => {
          const active = skills.includes(s);
          return (
            <button
              key={s}
              onClick={() => onToggle(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                active
                   ? "border-forest bg-forest/10 text-forest-dark"
                  : "border-line bg-parchment text-ink-soft hover:border-forest/40"
              }`}
            >
              {active && "âœ“ "}{s}
            </button>
          );
        })}
      </div>
      <form onSubmit={onAdd} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Add a custom skill..."
          className="flex-1 border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
        />
        <button
          type="submit"
          className="border border-line rounded-lg px-3 text-ink-soft hover:text-ink text-sm"
        >
          Add
        </button>
      </form>
    </>
  );
}

function StepEducation({ values, onChange }) {
  const fields = [
    { key: "university", label: "University / College", placeholder: "e.g. Shivaji University" },
    { key: "program", label: "Program / Course", placeholder: "e.g. B.Tech Computer Science" },
    { key: "year", label: "Year of Study", placeholder: "e.g. 3rd Year" },
    { key: "location", label: "Location", placeholder: "e.g. Pune, MH" },
  ];
  return (
    <>
      <h2 className="font-display text-xl mb-1">Your education</h2>
      <p className="text-sm text-ink-soft mb-5">
        This helps your peers find and connect with you.
      </p>
      <div className="space-y-3">
        {fields.map(({ key, label, placeholder }) => (
          <label key={key} className="block">
            <span className="text-xs font-medium text-ink-soft">{label}</span>
            <input
              value={values[key]}
              onChange={onChange(key)}
              placeholder={placeholder}
              className="mt-1 w-full border border-line rounded-lg px-3.5 py-2.5 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
            />
          </label>
        ))}
      </div>
    </>
  );
}

function StepGoals({ goals, draft, onDraftChange, onAdd, onRemove }) {
  return (
    <>
      <h2 className="font-display text-xl mb-1">Set your first goals</h2>
      <p className="text-sm text-ink-soft mb-5">
        What do you want to achieve You can add more later in the Development section.
      </p>
      {goals.length > 0 && (
        <ul className="space-y-2 mb-4">
          {goals.map((g) => (
            <li
              key={g}
              className="flex items-center justify-between text-sm bg-parchment border border-line rounded-lg px-3 py-2"
            >
              <span className="text-ink">{g}</span>
              <button
                onClick={() => onRemove(g)}
                className="text-xs text-ink-soft hover:text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={onAdd} className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder='e.g. "Learn React Hooks" or "Apply to 3 internships"'
          className="flex-1 border border-line rounded-lg px-3 py-2 text-sm bg-parchment focus:outline-none focus:ring-2 focus:ring-forest/40"
        />
        <button
          type="submit"
          className="border border-line rounded-lg px-3 text-ink-soft hover:text-ink text-sm"
        >
          Add
        </button>
      </form>
    </>
  );
}

function StepComplete({ interests, skills, goals }) {
  return (
    <div className="text-center py-2">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="font-display text-2xl">You're all set!</h2>
      <p className="text-sm text-ink-soft mt-2 mb-6">Here's what we've saved for your profile:</p>
      <div className="text-left space-y-3">
        <SummaryRow label={`${interests.length} interest${interests.length !== 1 ? "s" : ""}`} value={interests.join(", ") || "None selected"} />
        <SummaryRow label={`${skills.length} skill${skills.length !== 1 ? "s" : ""}`} value={skills.join(", ") || "None selected"} />
        <SummaryRow label={`${goals.length} goal${goals.length !== 1 ? "s" : ""}`} value={goals.join(", ") || "None added"} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="bg-parchment border border-line rounded-xl px-4 py-3">
      <p className="text-[11px] font-semibold text-ink-soft uppercase tracking-wide">{label}</p>
      <p className="text-sm text-ink mt-0.5 line-clamp-2">{value}</p>
    </div>
  );
}
