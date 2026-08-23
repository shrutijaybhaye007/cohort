import { format, parseISO } from "date-fns";
import { MapPin, Clock, ExternalLink, Wifi } from "lucide-react";

const TYPE_STYLES = {
  Internship: "bg-forest/10 text-forest-dark",
  Hackathon: "bg-gold/15 text-gold-dark",
  Workshop: "bg-walnut/10 text-walnut",
  Competition: "bg-purple-50 text-purple-700",
  Scholarship: "bg-blue-50 text-blue-700",
  Event: "bg-ink/[0.06] text-ink",
  Webinar: "bg-teal-50 text-teal-700",
};

/**
 * Opportunity card for the opportunities page.
 * Props: opportunity object with title, organization, type, location, isRemote, deadline,
 *        description, skills[], applyUrl
 */
export default function OpportunityCard({ opportunity }) {
  const {
    title,
    organization,
    type,
    location,
    isRemote,
    deadline,
    description,
    skills = [],
    applyUrl,
  } = opportunity;

  const typeStyle = TYPE_STYLES[type] || "bg-ink/[0.06] text-ink";

  const deadlineDate = deadline ? new Date(deadline) : null;
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate - Date.now()) / 86400000)
    : null;
  const deadlineUrgent = daysLeft !== null && daysLeft <= 7;

  return (
    <article className="bg-surface border border-line rounded-card shadow-card p-5 flex flex-col gap-3 hover:border-forest/30 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-ink leading-snug line-clamp-2">{title}</h3>
          <p className="text-xs text-ink-soft mt-0.5 truncate">{organization}</p>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeStyle}`}>
          {type}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-soft">
        {(location || isRemote) && (
          <span className="flex items-center gap-1">
            {isRemote ? <Wifi size={12} /> : <MapPin size={12} />}
            {isRemote ? "Remote" : location}
          </span>
        )}
        {daysLeft !== null && (
          <span className={`flex items-center gap-1 ${deadlineUrgent ? "text-red-600 font-medium" : ""}`}>
            <Clock size={12} />
            {daysLeft <= 0
              ? "Deadline passed"
              : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
            {deadlineDate && ` · ${format(deadlineDate, "d MMM")}`}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-ink leading-relaxed line-clamp-3">{description}</p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full bg-parchment border border-line text-[11px] text-ink-soft"
            >
              {s}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[11px] text-ink-soft">+{skills.length - 4}</span>
          )}
        </div>
      )}

      {/* CTA */}
      {applyUrl && (
        <a
          href={applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start flex items-center gap-1.5 text-xs font-semibold text-forest-dark bg-forest/10 hover:bg-forest/15 rounded-full px-4 py-1.5 transition-colors"
        >
          Apply <ExternalLink size={11} />
        </a>
      )}
    </article>
  );
}
