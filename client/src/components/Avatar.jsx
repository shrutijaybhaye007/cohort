function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({ user, size = 44, className = "" }) {
  if (!user) return null;
  return (
    <div
      className={`flex items-center justify-center rounded-full font-display font-medium text-white shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: user.avatarColor || "#2F5233",
        fontSize: size * 0.38,
      }}
      aria-hidden="true"
    >
      {initials(user.name)}
    </div>
  );
}
