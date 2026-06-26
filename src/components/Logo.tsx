type LogoSize = "default" | "lg" | "hero" | "auth";

const LOGO_SIZES: Record<
  LogoSize,
  { box: string; icon: string; text: string; gap: string }
> = {
  default: { box: "h-8 w-8", icon: "h-5 w-5", text: "text-lg font-bold", gap: "gap-2.5" },
  lg: { box: "h-10 w-10", icon: "h-6 w-6", text: "text-xl font-bold", gap: "gap-3" },
  auth: {
    box: "h-12 w-12",
    icon: "h-7 w-7",
    text: "text-[26px] leading-none font-bold",
    gap: "gap-3",
  },
  hero: {
    box: "h-14 w-14",
    icon: "h-8 w-8",
    text: "text-[30px] leading-none font-extrabold",
    gap: "gap-3.5",
  },
};

export function Logo({
  light = false,
  size = "default",
  className = "",
}: {
  light?: boolean;
  size?: LogoSize;
  className?: string;
}) {
  const s = LOGO_SIZES[size];
  return (
    <div
      className={`inline-flex items-center ${s.gap} ${className}`}
      role="img"
      aria-label="VegaPal"
    >
      <div
        className={`relative ${s.box} rounded-lg flex items-center justify-center shadow-sm ${
          light ? "bg-white/10 ring-1 ring-white/20" : "bg-navy"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`${s.icon} text-white`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 2 5 5v6c0 4.2 2.8 8 7 9.8 4.2-1.8 7-5.6 7-9.8V5l-7-3z" />
          <path d="M9 11.5 11 13.5 15 9.5" />
          <path d="M13.5 16.5V18.5" />
          <path d="M13.5 16.5l1.5-1.5 1 1 2.5-2.5" />
        </svg>
      </div>
      <span
        className={`${s.text} tracking-tight ${light ? "text-navy-foreground" : "text-foreground"}`}
      >
        VegaPal
      </span>
    </div>
  );
}
