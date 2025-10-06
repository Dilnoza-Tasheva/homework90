import { useEffect, useRef, useState } from "react";
import type {IncomingMessage, Pixel} from "./types";

const App = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState(4);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/paint");

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data) as IncomingMessage;

            switch (data.type) {
                case "INIT_PIXELS":
                    drawPixels(data.payload);
                    break;
                case "NEW_PIXELS":
                    drawPixels(data.payload);
                    break;
                default:
                    console.log("Unknown message:", data.type);
            }
        };

        ws.current.onclose = () => console.log("WebSocket closed");

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        ctx.current = context;
        ctx.current.lineCap = "round";
        ctx.current.lineJoin = "round";

        return () => {
            ws.current?.close();
        };
    }, []);

    const drawPixels = (pixels: Pixel[]) => {
        if (!ctx.current) return;
        pixels.forEach(({ x, y, color, size }) => {
            ctx.current!.fillStyle = color;
            ctx.current!.beginPath();
            ctx.current!.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.current!.fill();
        });
    };


    const drawAndSend = (e: React.MouseEvent) => {
        if (!canvasRef.current || !ctx.current || !ws.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const pixel: Pixel = { x, y, color, size };
        drawPixels([pixel]);

        ws.current.send(
            JSON.stringify({
                type: "DRAW_PIXELS",
                payload: [pixel],
            })
        );
    };

  return (
    <>
    </>
  )
};

export default App
