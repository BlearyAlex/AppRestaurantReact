import * as signalR from "@microsoft/signalr";

class SignalRService {
    private connection: signalR.HubConnection | null = null;

    build(getToken: () => string, baseUrl: string) {
        // ✅ Si ya existe y no está desconectada, no recrear
        if (this.connection &&
            this.connection.state !== signalR.HubConnectionState.Disconnected) return;

        // Si existe pero está desconectada, limpiar primero
        this.connection = null;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/orders`, {
                accessTokenFactory: () => {
                    const token = getToken();
                    return token;
                },
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    async start() {
        if (!this.connection) return;

        if (this.connection.state !== signalR.HubConnectionState.Disconnected) return;

        await this.connection.start();
    }

    async stop() {
        await this.connection?.stop();
        this.connection = null;
    }

    on<T>(event: string, callback: (data: T) => void) {
        this.connection?.on(event, callback);
    }

    off(event: string) {
        this.connection?.off(event);
    }

    getState() {
        return this.connection?.state;
    }
}

export const signalRService = new SignalRService();