"use client";

export default function ModalConversacion({ open, onClose, conversation }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Conversación del Usuario
        </h2>

        {/* CONTENEDOR FLEX QUE FALTABA */}
        <div className="flex flex-col space-y-4">
          {conversation?.messages?.map((msg, i) => {
            // evitar Invalid Date
            const fecha =
              msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "Sin fecha";

            return (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-purple-100 text-purple-900 self-start"
                    : "bg-gray-200 text-gray-800 self-end ml-auto"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className="text-[10px] mt-1 opacity-60 text-right">{fecha}</p>
              </div>
            );
          })}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
