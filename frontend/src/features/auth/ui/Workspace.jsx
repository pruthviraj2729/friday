import { ArrowUpRight, Command, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export default function Workspace() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-paper px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-white"><Command size={17} /></span>friday
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper">
            <LogOut size={15} /> Sign out
          </button>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-[#eae8fa] text-accent"><Sparkles size={24} /></div>
          <p className="mb-3 text-sm font-medium text-accent">Your workspace is ready</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">Good to have you, {user?.name.split(" ")[0]}.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">Friday brings your favorite AI models together. Your conversations will feel right at home here.</p>
          <div className="mt-9 flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-[#9b96d9]" /> AI conversations are coming soon <ArrowUpRight size={15} />
          </div>
        </section>
        <footer className="border-t border-line pt-5 text-xs text-muted">Signed in as {user?.email}</footer>
      </div>
    </main>
  );
}
