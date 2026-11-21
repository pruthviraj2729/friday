import { Check, Command, Sparkles } from "lucide-react";
import { Link } from "react-router";

export default function AuthLayout({ mode, children }) {
  const isRegister = mode === "register";

  return (
    <main className="min-h-screen bg-paper px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Link to="/login" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink" aria-label="Friday home">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-white"><Command size={17} strokeWidth={2.2} /></span>
            friday
          </Link>
          <span className="hidden text-sm text-muted sm:block">A calmer way to work with AI</span>
        </header>

        <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[1fr_0.85fr] lg:gap-28 lg:py-20">
          <section className="mx-auto w-full max-w-[500px]">
            <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-xs font-medium text-muted">
              <Sparkles size={14} className="text-accent" />
              One home for all your AI
            </div>
            <h1 className="max-w-md text-4xl font-semibold leading-[1.13] tracking-[-0.045em] text-ink sm:text-[52px]">
              {isRegister ? "Make room for better thinking." : "Your ideas deserve better tools."}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">
              {isRegister
                ? "Create your Friday account and bring your favorite AI models into one thoughtful workspace."
                : "Bring the best of every AI into one simple, focused place. Pick up where inspiration starts."}
            </p>
            <div className="mt-10 flex flex-wrap gap-2.5" aria-label="Supported AI models">
              {["Gemini", "ChatGPT", "Claude"].map((model) => (
                <span key={model} className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-ink">{model}</span>
              ))}
              <span className="rounded-full border border-line px-3.5 py-2 text-xs font-medium text-muted">and more</span>
            </div>
          </section>

          {children}
        </div>

        <footer className="flex flex-col gap-3 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Thoughtful tools. Clearer thinking.</span>
          <span className="flex items-center gap-2"><Check size={14} className="text-accent" /> Your conversations stay yours</span>
        </footer>
      </div>
    </main>
  );
}
