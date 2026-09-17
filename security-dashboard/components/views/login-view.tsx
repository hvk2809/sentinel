"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginView() {
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // Fallback to placeholders ("admin" / "admin") if fields are left blank
      const userToSubmit = username.trim() || "admin";
      const passToSubmit = password.trim() || "admin";

      const result = await login(userToSubmit, passToSubmit);
      if (result.success) {
        setSuccess(true);
      } else {
        setErrorMessage(result.error || "Invalid username or password.");
      }
    } catch {
      setErrorMessage("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF7F2] dark:bg-[#000000] text-white overflow-hidden p-4 select-none transition-colors duration-300">
      {/* Top Right Quick Theme Switcher */}
      {mounted && (
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D8D2C7] dark:border-[#1C1C1E] bg-[#FFFFFF] dark:bg-[#0C0C0C] text-[#5C574F] dark:text-[#8E8E93] hover:text-[#1A1917] dark:hover:text-white shadow-sm hover:shadow transition-all text-xs font-mono cursor-pointer"
          >
            {isLight ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-semibold text-zinc-800">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-zinc-300" />
                <span className="font-semibold text-zinc-300">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Background High-Tech Subtle Grid & Ambient Radial Light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#D5CFC6_1px,transparent_1px)] dark:bg-[radial-gradient(#1C1C1E_1px,transparent_1px)] [background-size:24px_24px] opacity-50 dark:opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 dark:bg-white/[0.02] rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* The Black Sign-In Part (Encapsulates White Logo & Login Form) */}
        <Card className="w-full bg-[#0C0C0C] border border-[#1C1C1E] shadow-2xl rounded-2xl p-6 sm:p-7 text-white">
          {/* Animated Brand Logo inside the Black Sign-In Container */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative animate-logo-entrance transition-transform duration-500 hover:scale-105">
              <img
                src="/logo.png"
                alt="Sentinel"
                className="h-24 sm:h-28 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]"
              />
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-md bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-mono animate-in fade-in-50 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 flex items-center gap-2.5 p-3 rounded-md bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-mono animate-in fade-in-50 duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Signed in successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
                <Input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || success}
                  className="pl-9 h-10 bg-[#050505] border-[#1C1C1E] text-white text-sm font-mono placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  className="pl-9 pr-10 h-10 bg-[#050505] border-[#1C1C1E] text-white text-sm font-mono placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading || success}
              className={cn(
                "w-full h-10 bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-5 active:scale-[0.99]",
                (loading || success) && "opacity-80"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : success ? (
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Signed In</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
