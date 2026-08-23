import { ExternalLink, Clock, BarChart2 } from "lucide-react";

const CATEGORY_STYLES = {
  "Web Development": "bg-blue-50 text-blue-700",
  "Programming": "bg-purple-50 text-purple-700",
  "AI/ML": "bg-forest/10 text-forest-dark",
  "Data Science": "bg-teal-50 text-teal-700",
  "Database": "bg-orange-50 text-orange-700",
  "Data Structures": "bg-red-50 text-red-700",
  "Communication": "bg-gold/15 text-gold-dark",
  "Interview Prep": "bg-walnut/10 text-walnut",
  "Resume Building": "bg-ink/[0.06] text-ink",
  "Career Development": "bg-green-50 text-green-700",
  "UI/UX": "bg-pink-50 text-pink-700",
  "Cybersecurity": "bg-gray-100 text-gray-700",
};

const DIFFICULTY_STYLES = {
  Beginner: "text-green-700",
  Intermediate: "text-gold-dark",
  Advanced: "text-red-600",
};

/**
 * Resource card for the resources page.
 * Props: resource { title, category, description, difficulty, estimatedHours, url, tags[] }
 */
export default function ResourceCard({ resource }) {
  const {
    title,
    category,
    description,
    difficulty,
    estimatedHours,
    url,
    tags = [],
  } = resource;

  const catStyle = CATEGORY_STYLES[category] || "bg-parchment text-ink-soft";
  const diffStyle = DIFFICULTY_STYLES[difficulty] || "text-ink-soft";

  return (
    <article className="bg-surface border border-line rounded-card shadow-card p-5 flex flex-col gap-3 hover:border-forest/30 transition-colors">
      {/* Category badge */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${catStyle}`}>
          {category}
        </span>
        <span className={`text-[11px] font-medium flex items-center gap-1 ${diffStyle}`}>
          <BarChart2 size={11} /> {difficulty}
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-semibold text-sm text-ink leading-snug line-clamp-2">{title}</h3>
        <p className="text-xs text-ink leading-relaxed mt-1.5 line-clamp-3">{description}</p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full bg-parchment border border-line text-[11px] text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        {estimatedHours && (
          <span className="text-[11px] text-ink-soft flex items-center gap-1">
            <Clock size={11} /> ~{estimatedHours}h
          </span>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-forest-dark hover:underline"
            aria-label={`Open ${title} in new tab`}
          >
            Start learning <ExternalLink size={11} />
          </a>
        )}
      </div>
    </article>
  );
}
