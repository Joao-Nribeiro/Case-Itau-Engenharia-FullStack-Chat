export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 15px",
        background: "#4c6ef5",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px"
      }}
    >
      {children}
    </button>
  );
}
