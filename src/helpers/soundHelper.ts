export const playNewOrderSound = () => {
    const audio = new Audio("/sounds/new-notification.mp3");
    audio.play().catch((error) => {
        console.error("Error al reproducir el sonido:", error);
    });
}