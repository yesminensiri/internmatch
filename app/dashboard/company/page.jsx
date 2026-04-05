"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function CompanyDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [offers, setOffers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("stage");
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "company") {
      router.push("/login");
      return;
    }

    // Load offers directly in useEffect to avoid setState in effect
    const loadOffers = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/offers/my", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId: session.user.id }),
        });

        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error("Failed to load offers:", error);
      }
    };

    loadOffers();
  }, [session, status, router]);

  const addOffer = async () => {
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    if (!session?.user?.id) return;

    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type, companyId: session.user.id }),
    });

    setTitle("");
    setDescription("");
    loadOffers();
  };

  const updateStatus = async (applicationId, status) => {
    await fetch("/api/applications/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });

    loadOffers();
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Company Dashboard</h1>
            <p className="mt-1 text-slate-600">Post new opportunities and manage applicants efficiently.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Offer</h2>

          <input
            placeholder="Title"
            className="mb-3 p-3 border border-slate-300 rounded-xl w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="mb-3 p-3 border border-slate-300 rounded-xl w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="mb-3 p-3 border border-slate-300 rounded-xl w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="stage">Internship</option>
            <option value="job">Job</option>
          </select>

          <button
            onClick={addOffer}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Post Offer
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {offers.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <h3 className="font-bold text-lg text-slate-900">{o.title}</h3>
              <p className="text-slate-600 mb-2">{o.description}</p>
              <p className="text-sm text-slate-500">Applicants: {o.stageApplicants}</p>

              <button
                onClick={() => setSelectedOffer(selectedOffer === o.id ? null : o.id)}
                className="mt-3 bg-violet-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-violet-700 transition"
              >
                View Applicants
              </button>

              {selectedOffer === o.id && (
                <div className="mt-4 space-y-3">
                  {o.applications.length === 0 ? (
                    <p className="text-slate-500">No applicants yet</p>
                  ) : (
                    o.applications.map((app) => (
                      <div key={app.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-bold text-slate-900">{app.student.name}</p>
                        <p className="text-sm text-slate-500">{app.student.email}</p>
                        <p className="text-sm mt-1">Status: <span className="font-semibold text-slate-700">{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></p>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateStatus(app.id, "accepted")}
                            className="bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600 transition"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            className="bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 transition"
                          >
                            Reject
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
    </div>
  );
}
