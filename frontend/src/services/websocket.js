let reconnectInterval = 1000;
let maxInterval = 10000;

let socket = null;
let usernameCache = null;

let listeners = [];
let pendingMessages = [];
let listenersApplied = false;

function flushPending() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  const toSend = [...pendingMessages];
  pendingMessages = [];

  toSend.forEach((msg) => {
    try {
      socket.send(JSON.stringify(msg));
    } catch {
      pendingMessages.push(msg);
    }
  });
}

export function createSocket(username) {
  if (socket) return socket;

  usernameCache = username;

  function connect() {
    socket = new WebSocket("ws://localhost:8000/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket conectado");

      safeSend({
        type: "join",
        username: usernameCache,
      });

      setTimeout(() => flushPending(), 50);
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
  if (listeners.indexOf(fn) === -1) {
    listeners.push(fn);
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.addEventListener("message", fn);
  }
}

export function sendMessage(data) {
  if (!safeSend(data)) {
    pendingMessages.push(data);
    return false;
  }
  return true;
}

export function safeSend(data) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    pendingMessages.push(data);
    return false;
  }

  try {
    socket.send(JSON.stringify(data));
    return true;
  } catch {
    pendingMessages.push(data);
    return false;
  }
}