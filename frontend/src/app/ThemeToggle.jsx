import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} theme`}
      className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-ink"
    >
      <Icon size={17} />
    </button>
  );
}
