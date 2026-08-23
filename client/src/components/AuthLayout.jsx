export default function AuthLayout({ eyebrow, title, children }) {
  return (
    <div className="min-h-screen bg-parchment flex">
      <div className="hidden lg:flex lg:w-1/2 bg-forest-dark text-parchment flex-col justify-between p-12 relative overflow-hidden">
        <RingField />
        <div className="relative z-10 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="13" cy="13" r="12" fill="none" stroke="rgba(246,243,236,0.35)" strokeWidth="1.5" />
            <circle cx="13" cy="13" r="8.5" fill="none" stroke="#E4C660" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="13" cy="13" r="3.2" fill="#E4C660" />
          </svg>
          <span className="font-display text-xl">Cohort</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-gold-light mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl leading-[1.15]">{title}</h1>
        </div>

        <p className="relative z-10 font-mono text-[11px] text-parchment/50">
          Built for students, alumni, and faculty — one record that keeps growing.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle cx="13" cy="13" r="12" fill="none" stroke="#E4DFD1" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="8.5" fill="none" stroke="#2F5233" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="13" cy="13" r="3.2" fill="#C9A227" />
            </svg>
            <span className="font-display text-xl">Cohort</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-forest-dark mb-2 lg:hidden">{eyebrow}</p>
          <h2 className="font-display text-2xl mb-6 lg:hidden">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function RingField() {
  const rings = [
    { cx: 90, cy: 120, r: 60 },
    { cx: 260, cy: 60, r: 40 },
    { cx: 300, cy: 260, r: 90 },
    { cx: 60, cy: 340, r: 50 },
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40"
      viewBox="0 0 380 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {rings.map((r, i) => (
        <circle key={i} cx={r.cx} cy={r.cy} r={r.r} fill="none" stroke="#4A7052" strokeWidth="1" strokeDasharray="3 4" />
      ))}
    </svg>
  );
}
