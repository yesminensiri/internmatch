"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.role) {
      switch (session.user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "student":
          router.push("/dashboard/student");
          break;
        case "company":
          router.push("/dashboard/company");
          break;
      }
    }
  }, [session, status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Invalid credentials");
      } else if (result?.ok) {
        // Redirect will happen automatically via useEffect
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-5">Welcome Back</h2>
        <p className="text-center text-slate-500 mb-6">Sign in to continue to the internship platform.</p>

        <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />

        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />

        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition mb-3">
          Login
        </button>

        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
        >
          Continue with Google 🚀
        </button>
      </form>
    </div>
  );
}
