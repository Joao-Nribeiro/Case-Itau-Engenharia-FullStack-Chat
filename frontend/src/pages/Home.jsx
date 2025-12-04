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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm mt-16 p-6 border border-gray-300 rounded-lg text-center shadow bg-white">
        <h2 className="text-xl font-semibold">Entre no Chat</h2>

        <input
          type="text"
          placeholder="Digite seu nome..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && entrarNoChat()}
          className="w-full p-3 mt-5 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        />

        <Button onClick={entrarNoChat}>Entrar</Button>
      </div>
    </div>
  );
}
