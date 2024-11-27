const mode = process.env.NODE_ENV === "production" ? "prod" : "dev";

export const SERVER_URL = {
    dev: 'ws://localhost:5000/ws',
    prod: 'https://facetime-32ow.onrender.com'
}[mode];
