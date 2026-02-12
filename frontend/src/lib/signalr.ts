import * as signalR from '@microsoft/signalr'
import { supabase } from './supabase'

let connection: signalR.HubConnection | null = null

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL ?? window.__env?.VITE_API_URL
    if (!url) return ''

    // Remover /api si existe para obtener la URL base
    return url.replace(/\/api$/, '')
}

export const createSignalRConnection = async (): Promise<signalR.HubConnection | null> => {
    if (connection) {
        return connection
    }

    try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.access_token) {
            console.warn('No hay token para SignalR')
            return null
        }

        const hubUrl = `${getApiUrl()}/hubs/notifications`

        connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => session.access_token
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Information)
            .build()

        return connection
    } catch (error) {
        console.error('Error creando conexión SignalR:', error)
        return null
    }
}

export const startConnection = async (): Promise<void> => {
    if (!connection) {
        await createSignalRConnection()
    }

    if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
        try {
            await connection.start()
            console.log('✅ SignalR conectado')
        } catch (error) {
            console.error('❌ Error conectando SignalR:', error)
        }
    }
}

export const stopConnection = async (): Promise<void> => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
        try {
            await connection.stop()
            console.log('SignalR desconectado')
        } catch (error) {
            console.error('Error desconectando SignalR:', error)
        }
    }
    connection = null
}

export const getConnection = (): signalR.HubConnection | null => connection

/**
 * Registrar un listener en la conexión SignalR
 * Si la conexión no existe aún, la crea primero
 */
export const onSignalREvent = async (
    eventName: string,
    callback: (...args: unknown[]) => void
): Promise<void> => {
    if (!connection) {
        await createSignalRConnection()
    }
    if (connection) {
        // Evitar listeners duplicados
        connection.off(eventName)
        connection.on(eventName, callback)
    }
}

/**
 * Remover un listener de la conexión SignalR
 */
export const offSignalREvent = (eventName: string): void => {
    if (connection) {
        connection.off(eventName)
    }
}