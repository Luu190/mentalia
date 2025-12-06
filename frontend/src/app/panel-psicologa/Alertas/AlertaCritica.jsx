export default function AlertaCritica({ cantidad, onVerAlertas }) {

  // ⭐ Ocultar si no hay alertas pendientes
  if (!cantidad || cantidad === 0) return null;

  return (
    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
      <span>⚠ {cantidad} alerta crítica sin atender</span>

      <button
        onClick={onVerAlertas}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
      >
        Ver Alertas
      </button>
    </div>
  );
}
