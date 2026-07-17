import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Braces, Check } from "lucide-react";

import { register } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function RegisterPage() {
  useDocumentTitle("Create account");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await register({ name, email, password });
      // The API returns a token on signup — log the user straight in.
      login(data.token);
      navigate("/problems");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-line bg-surface p-16 lg:flex lg:items-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative max-w-md">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-lg">
            <Braces size={28} strokeWidth={2.5} />
          </span>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-ink">
            Join Bracket.
          </h1>
          <p className="mt-4 text-lg leading-8 text-ink-muted">
            Create your free account and start solving coding challenges,
            bookmarking problems, and preparing for technical interviews.
          </p>
          <ul className="mt-8 space-y-3">
            {["Free to start", "No credit card required", "Progress saved automatically"].map(
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
        <form onSubmit={handleSubmit} className="card w-full max-w-md p-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Create account
          </h2>
          <p className="mt-1.5 text-sm text-ink-muted">Sign up for Bracket</p>

          {error && (
            <div className="mt-6 rounded-lg border border-hard/30 bg-hard/10 px-4 py-3 text-sm text-hard">
              {error}
            </div>
          )}

          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input px-4 py-3"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-ink"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary mt-6 w-full py-3"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?
            <Link
              to="/login"
              className="ml-1.5 font-semibold text-brand hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
