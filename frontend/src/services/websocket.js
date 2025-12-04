let reconnectInterval = 1000;
let maxInterval = 10000;

let socket = null;
let usernameCache = null;

let listeners = [];
let pendingMessages = [];

let listenersApplied = false;

export function createSocket(username) {
  usernameCache = username;

  function connect() {
    socket = new WebSocket("ws://localhost:8000/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket conectado");

      socket.send(
        JSON.stringify({
          type: "join",
          username: usernameCache,
        })
      );

      pendingMessages.forEach((msg) => {
        socket.send(JSON.stringify(msg));
      });
      pendingMessages = [];

      reconnectInterval = 1000;

      if (!listenersApplied) {
        listeners.forEach((fn) => {
          socket.addEventListener("message", fn);
        });
        listenersApplied = true;
      }
    };

    socket.onclose = () => {
      console.warn("WebSocket desconectado. Reconectando");

      listenersApplied = false;

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
  if (!listeners.includes(fn)) {
    listeners.push(fn);
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.addEventListener("message", fn);
  }
}

export function sendMessage(data) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    pendingMessages.push(data);
    return false;
  }

  socket.send(JSON.stringify(data));
  return true;
}