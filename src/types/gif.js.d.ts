declare module 'gif.js' {
  export interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    dither?: boolean | string;
    debug?: boolean;
    repeat?: number;
    transparent?: string | number[];
    dispose?: number;
  }

  export default class GIF {
    constructor(options: GIFOptions);
    addFrame(frame: HTMLCanvasElement | HTMLImageElement, options?: { delay?: number, copy?: boolean, dispose?: number }): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: string, callback: Function): void;
    render(): void;
    abort(): void;
  }
}
