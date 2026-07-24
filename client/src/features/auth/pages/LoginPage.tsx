import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Braces, Check } from "lucide-react";

import { login as loginService } from "../services/auth.service";
import { loginSchema, type LoginValues } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { errorMessage } from "../../../lib/errors";

export default function LoginPage() {
  useDocumentTitle("Sign in");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where the user was headed before being bounced to login (set by
  // RequireAuth). Land them back there rather than always on the list.
  const from = (location.state as { from?: { pathname: string; search: string; hash: string } } | null)?.from;
  const redirectTo = from ? `${from.pathname}${from.search}${from.hash}` : "/problems";

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    try {
      const data = await loginService(values);
      login(data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(errorMessage(err, "Invalid email or password."));
    }
  };

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-line bg-surface p-16 lg:flex lg:items-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative max-w-md">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-lg">
            <Braces size={28} strokeWidth={2.5} />
          </span>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-ink">
            Welcome back.
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Continue solving challenges, bookmark interview questions, and keep
            your streak alive with Bracket.
          </p>
          <ul className="mt-8 space-y-3">
            {["Curated problem set", "Track your progress", "Prep for real interviews"].map(
              (f) => (
                <li key={f} className="flex items-center gap-3 text-ink-muted">
                  <Check size={18} className="text-easy" />
                  {f}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="card w-full max-w-md p-8"
        >
          <h2 className="text-2xl font-bold tracking-tight text-ink">Sign in</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Sign in to your Bracket account
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-hard"
            >
              {formError}
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="input px-4 py-3"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-sm text-hard">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="input px-4 py-3 pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1.5 text-sm text-hard">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary mt-8 w-full py-3"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don't have an account?
            <Link
              to="/register"
              className="ml-1.5 font-semibold text-brand hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
