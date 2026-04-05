"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MyApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apps, setApps] = useState<{ id: number; offer: { title: string; company: { name: string } }; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "student") {
      router.push("/login");
      return;
    }

    // Load applications directly in useEffect
    const loadApplications = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const res = await fetch("/api/applications/my", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: session.user.id }),
        });

        if (res.ok) {
          const data = await res.json();
          setApps(data);
        }
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [session, status, router]);

  return (
    <div className="p-10 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">
        My Applications 💌
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">
          Loading applications... ⏳
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No applications yet 😢
        </div>
      ) : (
        apps.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-xl shadow mb-4">
            <h2 className="font-bold">{a.offer.title}</h2>
            <p className="text-gray-600">
              Company: {a.offer.company.name}
            </p>
            <p className="mt-2">
              Status:{" "}
              <span className={`font-bold ${
                a.status === "pending" ? "text-yellow-600" :
                a.status === "accepted" ? "text-green-600" :
                a.status === "rejected" ? "text-red-600" : "text-gray-600"
              }`}>
                {a.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}