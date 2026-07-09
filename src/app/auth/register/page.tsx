"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Loader2, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // In a real app we would hit a /api/register route first.
    // Here we just use our development credentials provider which auto-creates users.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result?.error) {
      router.push("/");
      router.refresh();
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1017] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg max-h-lg bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 mb-4">
            <span className="text-2xl">🔥</span>
          </div>
          <h1 className="text-3xl font-black text-white">Join the Hub</h1>
          <p className="text-gray-400 mt-2">Start transforming your life today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_25px_rgba(232,121,249,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-fuchsia-400 font-bold hover:text-fuchsia-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
