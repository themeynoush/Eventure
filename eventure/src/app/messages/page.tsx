"use client";

import useSWR from "swr";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function MessagesPage() {
  const { data: conversations, mutate } = useSWR("/api/conversations", (u) => axios.get(u).then(r => r.data));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
    const s = io(url);
    socketRef.current = s;
    s.on("message:new", (msg) => {
      setMessages((prev) => (msg.conversationId === activeId ? [...prev, msg] : prev));
    });
    return () => { s.disconnect(); };
  }, [activeId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeId) return;
      const res = await axios.get(`/api/messages?conversationId=${activeId}`);
      setMessages(res.data.items);
    };
    loadMessages();
  }, [activeId]);

  const send = async () => {
    if (!activeId || !input) return;
    const res = await axios.post("/api/messages", { conversationId: activeId, content: input });
    setInput("");
    socketRef.current?.emit("message:send", res.data.item);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border rounded">
        <div className="p-2 font-medium border-b">Conversations</div>
        <div className="divide-y">
          {(conversations?.items || []).map((c: any) => (
            <button key={c.id} className={`w-full text-left p-2 ${activeId === c.id ? "bg-gray-100" : ""}`} onClick={() => setActiveId(c.id)}>
              {c.title}
            </button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 border rounded flex flex-col">
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="border rounded p-2">
              <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t flex gap-2">
          <input className="border rounded flex-1 p-2" value={input} onChange={(e) => setInput(e.target.value)} />
          <button className="border rounded px-3" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}