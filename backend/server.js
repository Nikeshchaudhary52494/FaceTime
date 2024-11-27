const express = require('express');
const { WebSocketServer } = require('ws');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
    res.send('Signaling server is running');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });
const clients = new Map();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'offer':
            case 'answer':
            case 'candidate':
                const recipient = clients.get(data.to);
                if (recipient) {
                    recipient.send(JSON.stringify(data));
                }
                break;

            case 'join':
                clients.set(data.userId, ws);
                ws.userId = data.userId;
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        clients.delete(ws.userId);
        console.log('Client disconnected');
    });
});
