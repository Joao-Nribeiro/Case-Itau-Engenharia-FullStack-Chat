export default function UserMessages({ message, isMine, formatTime }) {
  const getStatusIcon = () => {
    if (!isMine) return null;

    switch (message.status) {
      case "pending":
        return "…";
      case "sent":
        return "•";
      case "received":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return <span className="text-cyan-400">✓✓</span>;
      default:
        return "";
    }
  };

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-[70%] shadow 
        ${isMine ? "bg-indigo-600 text-white" : "bg-indigo-100 text-black"}`}
      >
        {!isMine && (
          <p className="font-semibold mb-1">
            {message.username}
          </p>
        )}

        <p>{message.text}</p>

        <div
          className={`text-xs mt-1 opacity-80 ${
            isMine ? "text-right" : ""
          }`}
        >
          <span className="mr-1">{formatTime(message.timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}