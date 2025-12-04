import SystemMessage from "./SystemMessage";
import UserMessage from "./UserMessages";

export default function Messages({
  messages,
  username,
  formatTime,
  messagesEndRef,
}) {
  return (
    <div className="h-[60vh] overflow-y-auto flex flex-col gap-2 pr-1">
      {messages.map((m) =>
        m.type === "system" ? (
          <SystemMessage key={m.id || m.timestamp} text={m.text} />
        ) : (
          <UserMessage
            key={m.id}
            message={m}
            isMine={m.username === username}
            formatTime={formatTime}
          />
        )
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
