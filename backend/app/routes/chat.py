from fastapi import APIRouter, WebSocket
from app.services.connection_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_json()

            msg_type = data.get("type")
            username = data.get("username")
            text = data.get("text", "")

            if msg_type == "join":
                join_message = {
                    "type": "system",
                    "message": f"{username} entrou no chat."
                }
                await manager.broadcast(join_message)
                continue

            if msg_type == "message":
                msg_id = data["id"]

                await websocket.send_json({
                    "type": "ack",
                    "id": msg_id
                })

                formatted = {
                    "id": msg_id,
                    "type": "message",
                    "username": username,
                    "text": text,
                    "status": "delivered"
                }
                await manager.broadcast(formatted)
                continue

            if msg_type == "read":
                await manager.broadcast_except_sender({
                    "type": "read",
                    "id": data["id"]
                }, sender=websocket)
                continue

    except Exception:
        pass
    finally:
        manager.disconnect(websocket)
