import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { createSocket, getSocket, addMessageListener, sendMessage } from "../services/websocket";
import { v4 as uuid } from "uuid";

import Messages from "../components/Messages";
import ChatHeader from "../components/ChatHeader";
import InputField from "../components/InputField";

export default function Chat() {
  const [search] = useSearchParams();
  const username = search.get("user");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [msg, setMsg] = useState("");

  const messagesEndRef = useRef(null);
  const listenerAttached = useRef(false);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleMessage = useCallback(
    (event) => {
      if (!event?.data) return;
      const data = JSON.parse(event.data);

      if (data.type === "ack") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.id ? { ...m, status: "received" } : m
          )
        );
        return;
      }

      if (data.type === "read") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.id ? { ...m, status: "read" } : m
          )
        );
        return;
      }

      if (data.type === "system") {
        const exists = messages.some(
          (m) => m.type === "system" && m.text === data.message
        );

        if (!exists) {
          setMessages((prev) => [
            ...prev,
            { id: uuid(), type: "system", text: data.message },
          ]);
        }

        return;
      }

      setMessages((prev) => {
        const exists = prev.some((m) => m.id === data.id);
        if (exists) return prev;

        const isMine = data.username === username;

        if (!isMine) {
          const s = getSocket();
          s?.send(JSON.stringify({ type: "read", id: data.id }));
        }

        return [...prev, data];
      });
    },
    [username, messages]
  );

  useEffect(() => {
    if (!username) return;

    const socket = createSocket(username);

    return () => {
      if (socket) {
        socket.removeEventListener("message", handleMessage);
      }
      listenerAttached.current = false;
    };
  }, [username]);

  useEffect(() => {
    if (!listenerAttached.current) {
      addMessageListener(handleMessage);
      listenerAttached.current = true;
    }
  }, [handleMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function enviarMensagem() {
    if (!msg.trim()) return;

    const messageData = {
      id: uuid(),
      type: "message",
      username,
      text: msg,
      status: "sent",
      timestamp: Date.now(),
    };

    const sent = sendMessage(messageData);
    if (!sent) messageData.status = "pending";

    setMessages((prev) => [...prev, messageData]);
    setMsg("");
  }

  function formatTime(ts) {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="w-full flex justify-center py-6 px-3">
      <div className="w-full max-w-xl bg-white border border-gray-300 rounded-lg pl-5 pr-5 pt-5 shadow-sm">
        <ChatHeader username={username} />

        <Messages
          messages={messages}
          username={username}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
        />

        <InputField msg={msg} setMsg={setMsg} enviarMensagem={enviarMensagem} />
      </div>
    </div>
  );
}
