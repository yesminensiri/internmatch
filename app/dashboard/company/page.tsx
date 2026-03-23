"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
  id: number;
  status: string;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface Offer {
  id: number;
  title: string;
  description: string;
  type: string;
  stageApplicants: number;
  applications: Application[];
}

export default function CompanyDashboard() {
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("stage");
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  const company =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  useEffect(() => {
    if (!company || company.role !== "company") {
      router.push("/login");
      return;
    }
    loadOffers();
  }, []);

  const loadOffers = async () => {
    const res = await fetch("/api/offers/my", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyId: company.id }),
    });

    const data = await res.json();
    setOffers(data);
  };

  const addOffer = async () => {
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    await fetch("/api/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        type,
        companyId: company.id,
      }),
    });

    setTitle("");
    setDescription("");
    loadOffers();
  };

  // ✅ UPDATE STATUS FUNCTION
  const updateStatus = async (applicationId: number, status: string) => {
    await fetch("/api/applications/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, status }),
    });

    loadOffers(); // refresh after update
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-purple-700">
          Company Dashboard 🏢
        </h1>

        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-xl font-bold hover:scale-105 transition"
        >
          Logout 🚪
        </button>
      </div>

      {/* CREATE OFFER */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="font-bold text-xl mb-3">Create Offer</h2>

        <input
          placeholder="Title"
          className="mb-3 p-3 border rounded-xl w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="mb-3 p-3 border rounded-xl w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="mb-3 p-3 border rounded-xl w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="stage">Internship</option>
          <option value="job">Job</option>
        </select>

        <button
          onClick={addOffer}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-700 transition"
        >
          Post Offer
        </button>
      </div>

      {/* OFFERS */}
      <div className="grid md:grid-cols-2 gap-6">
        {offers.map((o) => (
          <div key={o.id} className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-bold text-lg">{o.title}</h3>
            <p>{o.description}</p>

            <p className="text-sm text-gray-500">
              Applicants: {o.stageApplicants}
            </p>

            <button
              onClick={() =>
                setSelectedOffer(selectedOffer === o.id ? null : o.id)
              }
              className="mt-2 bg-purple-500 text-white px-3 py-1 rounded"
            >
              View Applicants 👀
            </button>

            {/* APPLICANTS LIST */}
            {selectedOffer === o.id && (
              <div className="mt-4 space-y-2">
                {o.applications.length === 0 ? (
                  <p>No applicants yet</p>
                ) : (
                  o.applications.map((app) => (
                    <div key={app.id} className="border p-3 rounded-xl">
                      <p className="font-bold">{app.student.name}</p>
                      <p className="text-sm text-gray-500">
                        {app.student.email}
                      </p>

                      <p>Status: {app.status}</p>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateStatus(app.id, "accepted")
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Accept ✅
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(app.id, "rejected")
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject ❌
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}