import { EventEmitter } from 'node:events';
import { WebSocketServer, type WebSocket } from 'ws';

export interface WsBridgeOptions {
  port: number;
}

export class WsBridge extends EventEmitter {
  private wss?: WebSocketServer;
  private clients = new Set<WebSocket>();

  start(opts: WsBridgeOptions): void {
    this.wss = new WebSocketServer({ port: opts.port });
    this.wss.on('connection', (socket) => this.handleConnection(socket));
  }

  stop(): void {
    this.clients.forEach((client) => client.close());
    this.clients.clear();
    this.wss?.close();
    this.wss = undefined;
  }

  broadcast(message: unknown): void {
    const payload = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }

  private handleConnection(socket: WebSocket): void {
    this.clients.add(socket);
    socket.on('message', (data) => {
      try {
        const json = JSON.parse(String(data));
        this.emit('message', json, socket);
      } catch (err) {
        this.emit('error', err);
      }
    });
    socket.on('close', () => this.clients.delete(socket));
  }
}
