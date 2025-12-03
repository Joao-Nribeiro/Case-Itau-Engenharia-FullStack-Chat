from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()

    def register_user(self, websocket: WebSocket, username: str):
        self.active_connections[websocket] = username

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            del self.active_connections[websocket]

    def get_username(self, websocket: WebSocket):
        return self.active_connections.get(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections.keys()):
            try:
                await connection.send_json(message)
            except:
                pass

    async def broadcast_except_sender(self, message: dict, sender: WebSocket):
        for connection in list(self.active_connections.keys()):
            if connection is sender:
                continue
            try:
                await connection.send_json(message)
            except:
                pass
