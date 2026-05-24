import Link from "next/link";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  href,
  disabled = false,
  type,
  ...props
}) {
  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-[var(--accent)] text-white shadow-sm hover:bg-blue-700 active:bg-blue-800",
    outline:
      "border border-[var(--border-strong)] bg-white text-slate-900 hover:bg-slate-50",
    light:
      "bg-slate-100 text-slate-900 hover:bg-slate-200",
    secondary:
      "border border-white/20 bg-white/10 text-white hover:bg-white/15",
    ghost: "text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const classes = [
    base,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      type={type ?? "button"}
      {...props}
    >
      {children}
    </button>
  );
}
