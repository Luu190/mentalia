export function setupActivityMonitoring(token, onLogout) {
  if (!token) return;

  // Enviar ping al backend
  const sendPing = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/session/ping", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        onLogout();
      }
    } catch (err) {
      console.error("Ping error:", err);
    }
  };

  // Estos eventos cuentan como actividad
  const events = ["click", "mousemove", "keydown"];

  const registerActivity = () => {
    sendPing();
  };

  // Escuchar actividad
  events.forEach((ev) => {
    window.addEventListener(ev, registerActivity);
  });

  // También ping automático cada 2 min
  const interval = setInterval(sendPing, 120000);

  return () => {
    events.forEach((ev) => window.removeEventListener(ev, registerActivity));
    clearInterval(interval);
  };
}
