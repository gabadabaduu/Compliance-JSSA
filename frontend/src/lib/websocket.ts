import * as signalR from '@microsoft/signalr';

class SignalRService {
    private connections: Map<string, signalR.HubConnection> = new Map();

    connect(hubName: string): signalR.HubConnection {
        if (this.connections.has(hubName)) {
            return this.connections.get(hubName)!;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`/hubs/${hubName}`, {
                accessTokenFactory: () => localStorage.getItem('access_token') || '',
            })
            .withAutomaticReconnect()
            .build();

        connection.start().catch((err) => console.error('SignalR error:', err));

        this.connections.set(hubName, connection);
        return connection;
    }

    disconnect(hubName: string) {
        const connection = this.connections.get(hubName);
        if (connection) {
            connection.stop();
            this.connections.delete(hubName);
        }
    }
}

export const signalRService = new SignalRService();