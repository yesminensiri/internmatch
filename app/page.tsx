"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5">
        <h1 className="text-2xl font-bold text-purple-700">
          InternMatch 💼
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-xl border border-purple-500 text-purple-600 font-semibold hover:bg-purple-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 transition"
          >
            Register ✨
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-5xl font-extrabold text-purple-800 mb-6">
          Find Your Dream Internship 💖
        </h2>

        <p className="text-gray-600 max-w-2xl text-lg mb-8">
          InternMatch is a modern platform connecting students with companies.
          Discover internships, apply easily, and manage your career journey in one place.
        </p>

        <button
          onClick={() => router.push("/register")}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:scale-105 transition"
        >
          Get Started 🚀
        </button>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 px-10 mt-20 mb-20">
        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-pink-600 mb-2">For Students 👩‍🎓</h3>
          <p className="text-gray-600">
            Browse internship and job offers, apply easily , and track your applications.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-purple-600 mb-2">For Companies 🏢</h3>
          <p className="text-gray-600">
            Post job offers, manage candidates, and find the best talents easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold text-pink-500 mb-2">Smart Matching 💡</h3>
          <p className="text-gray-600">
            A simple and efficient system to connect the right student with the right opportunity.
          </p>
        </div>

      </div>

    </div>
  );
}