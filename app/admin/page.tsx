"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <h1 className="text-4xl font-bold text-pink-600 mb-6 text-center">
        Admin Dashboard ✨
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 p-3 rounded-xl shadow-md border border-purple-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-3xl shadow-lg hover:scale-105 transition transform"
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className={`font-semibold mb-4 ${user.role === "student" ? "text-blue-500" : user.role === "company" ? "text-purple-700" : "text-pink-600"}`}>
              {user.role}
            </p>
            <button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-xl font-bold hover:opacity-80 transition"
              onClick={() => alert("Delete clicked! 🚫 (fonction non opérationnelle)")}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No users found 😢</p>
      )}
    </div>
  );
}