import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { createSocket } from "../services/websocket";
import { v4 as uuid } from "uuid";

export default function Chat() {
  const [search] = useSearchParams();
  const username = search.get("user");

  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!username) return;

    const socket = createSocket(username);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ack") {
        setMessages((prev) =>
          prev.map((m) => (m.id === data.id ? { ...m, status: "received" } : m))
        );
        return;
      }

      if (data.type === "read") {
        setMessages((prev) =>
          prev.map((m) => (m.id === data.id ? { ...m, status: "read" } : m))
        );
        return;
      }

      if (data.type === "system") {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            text: data.message,
          },
        ]);
        return;
      }

      setMessages((prev) => {
        const exists = prev.find((m) => m.id === data.id);

        if (exists) {
          return prev.map((m) =>
            m.id === data.id ? { ...m, status: data.status } : m
          );
        }

        const isMine = data.username === username;

        if (!isMine) {
          socketRef.current.send(
            JSON.stringify({
              type: "read",
              id: data.id,
            })
          );
        }

        return [...prev, data];
      });
    };

    socket.onclose = () => {
      console.log("WebSocket desconectado");
    };

    return () => socket.close();
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    socketRef.current.send(JSON.stringify(messageData));

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
    <div>
      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          border: "1px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        <h2>Chat</h2>
        <p style={{ color: "#666" }}>
          Você está logado como <b>{username}</b>
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((m, i) => {
            if (m.type === "system") {
              return (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    color: "#777",
                    fontStyle: "italic",
                    margin: "10px 0",
                  }}
                >
                  {m.text}
                </div>
              );
            }

            const isMine = m.username === username;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: isMine ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    background: isMine ? "#4c6ef5" : "#edf0ff",
                    color: isMine ? "white" : "black",
                    borderRadius: "10px",
                    maxWidth: "70%",
                  }}
                >
                  {!isMine && <b>{m.username}</b>}
                  {!isMine && <br />}

                  {m.text}

                  <div
                    style={{
                      marginTop: "5px",
                      fontSize: "11px",
                      display: "flex",
                      justifyContent: "space-between",
                      opacity: 0.8,
                    }}
                  >
                    <span>{formatTime(m.timestamp)}</span>

                    {isMine && (
                      <span style={{ marginLeft: "10px" }}>
                        {m.status === "sent" && "•"}
                        {m.status === "received" && "✓"}
                        {m.status === "delivered" && "✓✓"}
                        {m.status === "read" && (
                          <span style={{ color: "#00c3ff" }}>✓✓</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Digite uma mensagem..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #aaa",
            }}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />

          <Button onClick={enviarMensagem}>Enviar</Button>
        </div>
      </div>
    </div>
  );
}
