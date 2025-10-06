import { useEffect, useRef, useState } from "react";

const App = () => {
    const [isDrawing, setIsDrawing] = useState(false);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/paint");

    }, []);



  return (
    <>
    </>
  )
};

export default App
