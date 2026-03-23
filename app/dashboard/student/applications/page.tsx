"use client";

import { useEffect, useState } from "react";

export default function MyApplications() {
  const [apps, setApps] = useState<any[]>([]);

  const student = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetch("/api/applications/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student.id }),
    })
      .then((res) => res.json())
      .then(setApps);
  }, []);

  return (
    <div className="p-10 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">
        My Applications 💌
      </h1>

      {apps.map((a) => (
        <div key={a.id} className="bg-white p-5 rounded-xl shadow mb-4">
          <h2 className="font-bold">{a.offer.title}</h2>
          <p className="text-gray-600">
            Company: {a.offer.company.name}
          </p>
          <p className="mt-2">
            Status:{" "}
            <span className="font-bold">
              {a.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}