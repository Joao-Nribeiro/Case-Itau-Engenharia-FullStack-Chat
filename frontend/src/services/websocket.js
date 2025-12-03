export function createSocket(username) {
  const socket = new WebSocket("ws://localhost:8000/ws/chat");

  socket.onopen = () => {
    console.log("Conectado ao servidor");
    socket.send(JSON.stringify({
      type: "join",
      username
    }));
  };

  return socket;
}
