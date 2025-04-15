import {WebSocketServer} from 'ws';

const activeConnections = new Map();

export const initWebSocket = (server) => {
    const wss = new WebSocketServer({server});

    wss.on("connection", (ws, req) => {
        const deliveryId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('deliveryId');

        if (!deliveryId) {
            ws.close(1008, 'Missing deliveryId');
            return;
        }

        if (!activeConnections.has(deliveryId)) {
            activeConnections.set(deliveryId, new Set());
        }
        activeConnections.get(deliveryId).add(ws);

        ws.on('close', () => {
            activeConnections.get(deliveryId)?.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
};

export const broadcastUpdate = (deliveryId, data) => {
    const connections = activeConnections.get(deliveryId) || [];
    connections.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({
                event: 'delivery_update',
                data,
                timestamp: new Date().toISOString()
            }));
        }
    });
};