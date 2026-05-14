"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, LogIn, ShieldCheck, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

const API = "http://localhost:4000/api/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // ✅ Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API}/me`, { withCredentials: true });
        router.push("/admin/auth/dashboard");
      } catch {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/login`, form, { withCredentials: true });
      router.push("/admin/auth/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  // ✅ Loading screen
  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (

    <Fragment>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 overflow-y-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl" />
        </div>

        {/* Card */}
        <div className="relative w-full max-w-md">

          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/30 to-teal-400/20 rounded-3xl blur-sm" />

          <div className="relative bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">

            {/* Header */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 px-8 pt-10 pb-8 text-center border-b border-gray-800">

              {/* Icon */}
              <div className="relative inline-flex mb-5">
                <div className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-md" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin Portal
              </h1>
              <p className="text-gray-400 text-sm mt-1.5">
                Jigyasa Super Speciality Hospital
              </p>

              {/* Divider dots */}
              <div className="flex items-center justify-center gap-1.5 mt-5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <div className="w-8 h-px bg-gradient-to-r from-teal-500/50 to-transparent" />
                <div className="w-1 h-1 rounded-full bg-teal-500/40" />
                <div className="w-8 h-px bg-gradient-to-l from-teal-500/50 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 flex flex-col gap-5">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="hospital@.com"
                    required
                    className="w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                  />
                  {/* bottom line animation */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-300 group-focus-within:w-full" />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3.5 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-300 group-focus-within:w-full" />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold text-sm rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-1"
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to Dashboard
                  </>
                )}
              </button>

              {/* Footer note */}
              <p className="text-center text-xs text-gray-600 mt-1">
                Protected area · Authorized personnel only
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </Fragment>

  );
}