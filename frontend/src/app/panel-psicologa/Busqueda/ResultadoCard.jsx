export default function ResultadoCard({ data }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">

      <p className="text-gray-800 text-sm">
        <strong>ID de sesión:</strong> {data.sessionId}
      </p>

      <p className="text-gray-600 text-sm mt-1">
        <strong>ID conversación:</strong> {data._id}
      </p>

      <p className="text-gray-400 text-xs mt-2">
        Esta conversación contiene la palabra buscada.
      </p>
    </div>
  );
}
