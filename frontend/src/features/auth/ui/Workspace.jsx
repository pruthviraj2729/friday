import { ArrowUpRight, Command, LogOut } from "lucide-react";
import ThemeToggle from "../../../app/ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Workspace() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-paper px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-inverse"><Command size={17} /></span>friday
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper">
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="mb-3 inline-flex rounded-full bg-[#202124] px-3 py-1 text-sm font-medium text-white">Your workspace is ready</p>
          <h1 className="flex flex-wrap items-center justify-center gap-3 text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
            <img src="/friday-mark.png" alt="Friday logo" className="friday-mark h-10 w-10 shrink-0 object-contain" />
            <span>Good to have you, {user?.name.split(" ")[0]}.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">Friday brings your favorite AI models together. Your conversations will feel right at home here.</p>
          <div className="mt-9 flex items-center gap-2 rounded-full bg-[#202124] px-4 py-2.5 text-sm text-white">
            <span className="h-2 w-2 rounded-full bg-white" /> AI conversations are coming soon <ArrowUpRight size={15} />
          </div>
        </section>
        <footer className="border-t border-line pt-5 text-xs text-muted">Signed in as {user?.email}</footer>
      </div>
    </main>
  );
}
