"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Offer {
  id: number;
  title: string;
  description: string;
  type: string;
  company: {
    id: number;
    name: string;
  };
}

interface Application {
  id: number;
  offerId: number;
  status: string;
  offer: {
    title: string;
    company: {
      name: string;
    };
  };
}

export default function StudentDashboard() {
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const student =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    if (!student || student.role !== "student") {
      router.push("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    // Fetch offers
    const offersRes = await fetch("/api/offers");
    const offersData = await offersRes.json();
    setOffers(offersData);

    // Fetch applications
    const appsRes = await fetch("/api/applications/my", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId: student.id }),
    });

    const appsData = await appsRes.json();
    setApplications(appsData);
  };

  const apply = async (offerId: number) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId: student.id, offerId }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Applied successfully 💖");
    loadData();
  };

  const getApplication = (offerId: number) => {
    return applications.find((a) => a.offerId === offerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-pink-600">
          Student Dashboard 👩‍🎓
        </h1>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          Logout 🚪
        </button>
      </div>

      {/* ===================== */}
      {/* ✅ MY APPLICATIONS */}
      {/* ===================== */}
      <h2 className="text-2xl font-bold text-purple-600 mb-4">
        My Applications 💼
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500 mb-8">You haven't applied yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {applications.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-bold">{app.offer.title}</h3>

              <p className="text-sm text-gray-500">
                Company: {app.offer.company.name}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span
                  className={
                    app.status === "accepted"
                      ? "text-green-500"
                      : app.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {app.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ===================== */}
      {/* ✅ AVAILABLE OFFERS */}
      {/* ===================== */}
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Available Offers 📢
      </h2>

      {offers.length === 0 ? (
        <p className="text-gray-500">No offers available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((o) => {
            const app = getApplication(o.id);

            return (
              <div
                key={o.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">{o.title}</h3>
                <p className="text-gray-700 mb-2">{o.description}</p>

                <p className="text-sm text-gray-500 mb-3">
                  Company: {o.company.name}
                </p>

                {app ? (
                  <p className="text-purple-600 font-bold">
                    Already applied ✔
                  </p>
                ) : (
                  <button
                    onClick={() => apply(o.id)}
                    className="bg-pink-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-pink-600 transition"
                  >
                    Apply 💌
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}