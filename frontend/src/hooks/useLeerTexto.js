export function useLeerTexto() {
  function leerTexto(texto) {
    if (!texto || typeof texto !== "string") return;

    // Limpia cualquier lectura previa
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(texto);

    // Configurar voz española
    const voices = window.speechSynthesis.getVoices();
    const voz = voices.find(v => v.lang.startsWith("es")) || voices[0];
    msg.voice = voz;

    msg.lang = "es-ES";
    msg.rate = 1;
    msg.pitch = 1;

    window.speechSynthesis.speak(msg);
  }

  return { leerTexto };
}
