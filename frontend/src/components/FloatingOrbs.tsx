interface FloatingOrbsProps {
  /** "dark" for moss/hero surfaces, "light" for paper surfaces */
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Purely decorative, low-opacity animated color blobs. Drop into any
 * `relative overflow-hidden` container to keep large empty surfaces (hero
 * panels, sidebars, auth screens) from feeling flat and static.
 */
export default function FloatingOrbs({ variant = "dark", className = "" }: FloatingOrbsProps) {
  const palette =
    variant === "dark"
      ? ["#C6F135", "#5FC9D6", "#F2B84B"]
      : ["#A9D91C", "#8FE0EA", "#F6CD7C"];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div
        className="blob w-72 h-72 -top-16 -left-10 animate-blob"
        style={{ backgroundColor: palette[0], opacity: variant === "dark" ? 0.16 : 0.25 }}
      />
      <div
        className="blob w-64 h-64 top-1/3 -right-16 animate-blob-slow"
        style={{ backgroundColor: palette[1], opacity: variant === "dark" ? 0.14 : 0.2 }}
      />
      <div
        className="blob w-56 h-56 -bottom-20 left-1/4 animate-blob"
        style={{ backgroundColor: palette[2], opacity: variant === "dark" ? 0.13 : 0.18, animationDelay: "3s" }}
      />
    </div>
  );
}
