const express = require('express');
const path = require('path');
const { WebSocketServer } = require('ws');
const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/', (req, res) => {
    res.send('Signaling server is running');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start the HTTP server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// WebSocket signaling server
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
                // Forward signaling data to the recipient
                const recipient = clients.get(data.to);
                if (recipient) {
                    recipient.send(JSON.stringify(data));
                }
                break;

            case 'join':
                // Register the client with a unique userId
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
