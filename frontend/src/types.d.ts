export interface Pixel {
    x: number;
    y: number;
    color: string;
    size: number;
}

export interface IncomingMessage {
    type: string;
    payload: any;
}