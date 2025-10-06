import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import crypto from "crypto";
import {ActiveConnections, IncomingMessage, Pixel} from "./types";

const port = 8000;
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);

wsInstance.applyTo(router);

app.use(cors());

const activeConnections: ActiveConnections = {};
const pixels: Pixel[] = [];

router.ws('/paint', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('client connected');
    activeConnections[id] = ws;

    ws.on("message", (message: string) => {
        try {
            const data = JSON.parse(message.toString()) as IncomingMessage;

            switch (data.type) {
                case "DRAW_PIXELS":
                    const newPixels = data.payload as Pixel[];
                    pixels.push(...newPixels);

                    Object.values(activeConnections).forEach((client) => {
                        client.send(
                            JSON.stringify({
                                type: "NEW_PIXELS",
                                payload: newPixels,
                            })
                        );
                    });
                    break;

                default:
                    console.log("Unknown message type:", data.type);
            }
        } catch (err) {
            console.error("Error sending the message:", err);
        }
    });



    ws.on('close', () => {
        console.log('client disconnected');
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
