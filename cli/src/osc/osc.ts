import { EventEmitter } from 'node:events';
import oscDefault, { UDPPort, type MetaArgument, type OscMessage } from 'osc';

export interface OscClientOptions {
  localAddress?: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
}

export class OscClient extends EventEmitter {
  private readonly udpPort: UDPPort;

  constructor(opts: OscClientOptions) {
    super();
    this.udpPort = new oscDefault.UDPPort({
      localAddress: opts.localAddress ?? '0.0.0.0',
      localPort: opts.localPort,
      remoteAddress: opts.remoteAddress,
      remotePort: opts.remotePort,
      metadata: true
    });

    this.udpPort.on('ready', () => this.emit('ready'));
    this.udpPort.on('message', (msg: OscMessage) => this.emit('message', msg));
    this.udpPort.on('error', (err: Error) => this.emit('error', err));
    this.udpPort.open();
  }

  send(address: string, args: MetaArgument[] = []): void {
    this.udpPort.send({ address, args });
  }

  close(): void {
    this.udpPort.close();
  }
}
