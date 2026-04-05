"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || session.user.role !== "student") {
      router.push("/login");
      return;
    }

    // Load data directly in useEffect to avoid setState in effect
    const loadData = async () => {
      if (!session?.user?.id) return;
      const studentId = session.user.id;

      const offersRes = await fetch("/api/offers");
      const offersData = await offersRes.json();
      setOffers(offersData);

      const appsRes = await fetch("/api/applications/my", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const appsData = await appsRes.json();
      setApplications(appsData);
    };

    loadData();
  }, [session, status, router]);

  const apply = async (offerId) => {
    if (!session?.user?.id) return;
    const studentId = session.user.id;

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, offerId }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    alert("Applied successfully 💖");
    loadData();
  };

  const getApplication = (offerId) => applications.find((a) => a.offerId === offerId);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen bg-slate-50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Student Dashboard</h1>
            <p className="mt-1 text-slate-600">Manage your applications and explore the best opportunities.</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2 rounded-xl font-semibold shadow hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>

        <section className="mb-8 rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <p className="text-slate-500">You haven&apos;t applied yet. Find your first match below.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {applications.map((app) => (
                <div key={app.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-slate-900">{app.offer.title}</h3>
                  <p className="text-sm text-slate-500">{app.offer.company.name}</p>
                  <p className="mt-3 text-sm font-medium">
                    Status: 
                    <span
                      className={
                        app.status === "accepted"
                          ? "text-emerald-600"
                          : app.status === "rejected"
                          ? "text-rose-600"
                          : "text-amber-500"
                      }
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 md:p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Available Offers</h2>
          {offers.length === 0 ? (
            <p className="text-slate-500">No offers available. Please check back shortly.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {offers.map((o) => {
                const app = getApplication(o.id);
                return (
                  <div key={o.id} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white p-5 shadow-sm hover:shadow-lg transition">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{o.title}</h3>
                    <p className="text-slate-600 mb-2">{o.description}</p>
                    <p className="text-sm text-slate-500 mb-4">Company: {o.company.name}</p>

                    {app ? (
                      <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-semibold">Already applied</span>
                    ) : (
                      <button
                        onClick={() => apply(o.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
