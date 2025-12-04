export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition shadow-sm"
    >
      {children}
    </button>
  );
}
