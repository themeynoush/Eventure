"use client";

import useSWR from "swr";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { data } = useSWR("/api/users/me", (u) => axios.get(u).then(r => r.data));
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  useEffect(() => {
    if (data?.profile) {
      setBio(data.profile.bio || "");
      setInterests((data.profile.interests || []).join(", "));
    }
  }, [data]);

  const onSave = async () => {
    await axios.patch("/api/users/me", { bio, interests: interests.split(",").map((s) => s.trim()).filter(Boolean) });
    alert("Saved");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Your Profile</h1>
      <div className="flex flex-col gap-3">
        <label className="text-sm">Bio</label>
        <textarea className="border rounded p-2" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        <label className="text-sm">Interests (comma-separated)</label>
        <input className="border rounded p-2" value={interests} onChange={(e) => setInterests(e.target.value)} />
        <button className="border rounded px-3 py-2 w-fit" onClick={onSave}>Save</button>
      </div>
    </div>
  );
}