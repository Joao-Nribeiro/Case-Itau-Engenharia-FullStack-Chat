import Button from "./Button";

export default function InputField({ msg, setMsg, enviarMensagem }) {
  return (
    <div className="-mx-5 mb-0  p-4  rounded-b-md">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          className="flex-1 px-3 py-2 border border-indigo-500/80 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <Button onClick={enviarMensagem}>Enviar</Button>
      </div>
    </div>
  );
}
