"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AlertCircle, User, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/account";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: 'rahim@gmail.com', password: 'password123' });

  const saveAuthSession = (user: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax;`;
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax;`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password
      });

      if (res.data?.success && res.data.user) {
        saveAuthSession(res.data.user, res.data.token || `token-${Date.now()}`);
        
        if (res.data.user.role === 'admin') {
          window.location.href = 'http://localhost:3001';
          return;
        }

        window.location.href = callbackUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string = 'password123') => {
    setForm({ email: demoEmail, password: demoPass });
    setLoading(true);
    setError("");
    try {
      const res = await api.post('/auth/login', {
        email: demoEmail,
        password: demoPass
      });
      if (res.data?.success && res.data.user) {
        saveAuthSession(res.data.user, res.data.token || `token-${Date.now()}`);
        window.location.href = callbackUrl;
      }
    } catch (err: any) {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white tracking-tighter">
            Bazaar<span className="text-emerald-500">BD</span>
          </Link>
          <h1 className="text-xl font-semibold text-white mt-4">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage orders, checkout, and payments</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-300">Email Address / Phone</label>
            <input
              type="text"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="rahim@gmail.com"
              className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-medium text-gray-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-400">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500 transition-colors"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold mt-2">
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </Button>
        </form>

        {/* Quick Demo Login Credentials */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
          <span className="text-[11px] text-gray-400 block text-center font-medium">Quick 1-Click Demo Accounts:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('rahim@gmail.com')}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-left text-xs transition-colors"
            >
              <p className="font-semibold text-white truncate">Rahim Uddin</p>
              <p className="text-[10px] text-gray-400">Dhaka Customer</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('nusrat@yahoo.com')}
              className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-left text-xs transition-colors"
            >
              <p className="font-semibold text-white truncate">Nusrat Jahan</p>
              <p className="text-[10px] text-gray-400">Chittagong Customer</p>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6 pt-4 border-t border-white/10">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-500 hover:text-emerald-400 font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[85vh] px-4 py-12">
      <Suspense fallback={<div className="text-center text-gray-400">Loading authentication...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
