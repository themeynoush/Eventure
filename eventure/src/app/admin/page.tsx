"use client";

import useSWR from "swr";
import axios from "axios";

export default function AdminPage() {
  const { data: users, mutate: mu } = useSWR("/api/admin/users", (u) => axios.get(u).then(r => r.data));
  const { data: events, mutate: me } = useSWR("/api/admin/events", (u) => axios.get(u).then(r => r.data));

  const toggleRole = async (id: string, role: string) => {
    await axios.patch(`/api/admin/users?id=${id}`, { role });
    mu();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <section>
        <h2 className="font-medium mb-2">Users</h2>
        <div className="border rounded divide-y">
          {(users?.items || []).map((u: any) => (
            <div key={u.id} className="p-2 flex items-center justify-between">
              <div>{u.email} <span className="text-xs">({u.role})</span></div>
              <div className="flex gap-2">
                <button className="border rounded px-2 py-1" onClick={() => toggleRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}>Toggle Role</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-medium mb-2">Events</h2>
        <div className="border rounded divide-y">
          {(events?.items || []).map((e: any) => (
            <div key={e.id} className="p-2">
              <div className="font-medium">{e.title}</div>
              <div className="text-xs">{e.address}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}