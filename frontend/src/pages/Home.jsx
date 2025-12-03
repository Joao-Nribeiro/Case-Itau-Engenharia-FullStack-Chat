import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function entrarNoChat() {
    if (username.trim() === "") return alert("Digite um nome!");

    navigate(`/chat?user=${username}`);
  }

  return (
    <div>

      <div style={{
        maxWidth: "400px",
        margin: "60px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <h2>Entre no Chat</h2>

        <input
          type="text"
          placeholder="Digite seu nome..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        />

        <Button onClick={entrarNoChat}>Entrar</Button>
      </div>
    </div>
  );
}
