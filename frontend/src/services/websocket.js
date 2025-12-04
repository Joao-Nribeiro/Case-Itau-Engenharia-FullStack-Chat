let reconnectInterval = 1000;
let maxInterval = 10000;
let socket = null;
let usernameCache = null;
let listeners = [];

export function createSocket(username) {
  usernameCache = username;

  function connect() {
    socket = new WebSocket("ws://localhost:8000/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket conectado");
      reconnectInterval = 1000;
      socket.send(JSON.stringify({ type: "join", username: usernameCache }));

      listeners.forEach((fn) => (socket.onmessage = fn));
    };

    socket.onclose = () => {
      console.warn("WebSocket desconectado. Reconectando");

      setTimeout(() => {
        reconnectInterval = Math.min(maxInterval, reconnectInterval * 1.5);
        connect();
      }, reconnectInterval);
    };

    socket.onerror = (err) => {
      console.log("WebSocket error:", err);
      socket.close();
    };
  }

  connect();
  return socket;
}

export function getSocket() {
  return socket;
}


export function addMessageListener(fn) {
  listeners.push(fn);
  if (socket) socket.onmessage = fn;
}
