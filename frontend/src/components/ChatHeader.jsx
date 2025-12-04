export default function ChatHeader({ username }) {
  return (
    <div className="-mx-5 -mt-5 bg-indigo-500/80 backdrop-blur-sm p-4 rounded-t-lg shadow-sm">
      <h2 className="text-lg font-semibold text-white">Chat</h2>

      <p className="text-indigo-100">
        Você está logado como <b className="text-white">{username}</b>
      </p>
    </div>
  );
}
