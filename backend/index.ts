import express from "express";
import expressWs from "express-ws";
import cors from "cors";

const port = 8000;
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);

wsInstance.applyTo(router);

app.use(cors());

router.ws('/paint', (ws, req) => {
    console.log('client connected');

    ws.on('close', () => {
        console.log('client disconnected');
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
