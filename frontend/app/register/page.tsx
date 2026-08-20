"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('123456');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    division: 'Dhaka',
    district: 'Dhaka',
    address: '',
    terms: true
  });

  const saveAuthSession = (user: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax;`;
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax;`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please retype password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        division: form.division,
        district: form.district,
        address: form.address
      };

      const res = await api.post('/auth/register', payload);
      if (res.data?.success && res.data.user) {
        const token = res.data.token || `token-${Date.now()}`;
        saveAuthSession(res.data.user, token);
        alert(`Welcome to BazaarBD, ${res.data.user.name}! Your account has been registered.`);
        window.location.href = '/account';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration error. Please check your inputs.");
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[85vh] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-white tracking-tighter">
              Bazaar<span className="text-emerald-500">BD</span>
            </Link>
            {step === 'form' ? (
              <>
                <h1 className="text-xl font-semibold text-white mt-4">Create Your Account</h1>
                <p className="text-gray-400 text-sm mt-1">Register to start shopping and track orders</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mt-4 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-semibold text-white">Verify Phone Number</h1>
                <p className="text-gray-400 text-sm mt-1">A verification code was sent to <strong>{form.phone || "+880 17XXXXXXXX"}</strong></p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Full Name *</label>
                <input 
                  required 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Tanvir Rahman" 
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Email Address *</label>
                <input 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="tanvir@gmail.com" 
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300">Mobile Phone (01XXXXXXXXX) *</label>
                <input 
                  type="tel" 
                  required 
                  value={form.phone} 
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="01712345678" 
                  className="w-full bg-bg-primary border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Password *</label>
                  <input 
                    type="password" 
                    required 
                    minLength={6} 
                    value={form.password} 
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 6 chars" 
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-300">Confirm *</label>
                  <input 
                    type="password" 
                    required 
                    value={form.confirm} 
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Repeat" 
                    className="w-full bg-bg-primary border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-gray-500" 
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={form.terms}
                  onChange={e => setForm(f => ({ ...f, terms: e.target.checked }))}
                  required 
                  className="accent-emerald-500 w-4 h-4 mt-0.5" 
                />
                <span className="text-xs text-gray-400">
                  I agree to the <Link href="/terms" className="text-emerald-500 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-500 hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" disabled={loading} className="w-full h-11 text-base font-semibold mt-2">
                {loading ? 'Processing...' : 'Continue with Phone Verification →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCompleteRegistration} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 text-center block">6-Digit Security OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                />
                <p className="text-xs text-center text-gray-400">Default Sandbox OTP: <strong className="text-emerald-400 font-mono">123456</strong></p>
              </div>

              <Button type="submit" disabled={loading || otp.length < 4} className="w-full h-11 text-base font-semibold">
                {loading ? 'Creating Account in Database...' : 'Verify OTP & Finish Account Setup'}
              </Button>

              <button 
                type="button" 
                onClick={() => setStep('form')} 
                className="w-full text-xs text-gray-400 hover:text-white transition-colors text-center block"
              >
                ← Change Registration Details
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6 pt-4 border-t border-white/10">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
