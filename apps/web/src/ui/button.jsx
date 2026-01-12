export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  href,
  disabled = false,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed";

  // Variantes consistentes con Login / Register
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    light:
      "bg-white text-blue-600 hover:bg-blue-50 focus:ring-white border border-gray-200",
    secondary:
      "border border-white/40 text-white hover:bg-white/10 focus:ring-white",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-600",
    ghost: "text-blue-600 hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `
    ${base}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return href ? (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  ) : (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
