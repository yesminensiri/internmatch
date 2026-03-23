"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) throw new Error("Failed to create account");

      const newUser = await res.json(); // get the created user

      // Save user in localStorage for dashboard auth
      localStorage.setItem("user", JSON.stringify(newUser));

      alert(`Account created 💖`);

      // Redirect based on role
      if (role === "student") router.push("/dashboard/student");
      else if (role === "company") router.push("/dashboard/company");
      else router.push("/dashboard"); // fallback

    } catch (error) {
      console.error(error);
      alert("Error creating account 😢");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl w-96"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Create Account 💄
        </h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 p-3 border rounded-xl"
          required
        />
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
        <select
          className="w-full mb-4 p-3 border rounded-xl"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student 👩‍🎓</option>
          <option value="company">Company 🏢</option>
        </select>
        <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition">
          Register
        </button>
      </form>
    </div>
  );
}