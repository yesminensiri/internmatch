"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save logged-in user in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        alert(`Welcome ${data.name} 💖`);

        // Redirect based on role
        switch (data.role) {
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
      } else {
        // show backend error
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong 😢");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl w-96">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Login 💄</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-xl"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded-xl"
          required
        />
        <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition">
          Login
        </button>
      </form>
    </div>
  );
}