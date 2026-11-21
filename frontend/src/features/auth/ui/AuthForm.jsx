import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function AuthField({ label, type = "text", name, placeholder, value, onChange, error, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input
        className={`field ${error ? "field-error" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        required
      />
      {error && <span id={`${name}-error`} className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function AuthForm({ mode }) {
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signIn, signUp, isSubmitting, error, fieldErrors, clearError } = useAuth();

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (error) clearError();
  }

  async function submit(event) {
    event.preventDefault();
    const authenticated = await (isRegister ? signUp : signIn)(form);
    if (authenticated) navigate("/workspace", { replace: true });
  }

  return (
    <section className="mx-auto w-full max-w-[430px] rounded-[26px] border border-line bg-white p-7 sm:p-9">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{isRegister ? "Create your account" : "Welcome back"}</h2>
        <p className="mt-2 text-sm text-muted">{isRegister ? "A little space for your next big idea." : "Sign in to continue to your workspace."}</p>
      </div>
      <form onSubmit={submit} className="space-y-5" noValidate>
        {isRegister && (
          <AuthField label="Your name" name="name" placeholder="Alex Morgan" value={form.name} onChange={update} error={fieldErrors.name} autoComplete="name" />
        )}
        <AuthField label="Email address" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={update} error={fieldErrors.email} autoComplete="email" />
        <AuthField label="Password" type="password" name="password" placeholder={isRegister ? "At least 8 characters" : "Enter your password"} value={form.password} onChange={update} error={fieldErrors.password} autoComplete={isRegister ? "new-password" : "current-password"} />
        {error && !Object.keys(fieldErrors).length && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <button className="primary-button group" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Sign in"}</span>
          {!isSubmitting && <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? "Already have an account?" : "New to Friday?"}{" "}
        <Link
          to={isRegister ? "/login" : "/register"}
          onClick={clearError}
          className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
