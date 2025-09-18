declare module 'osc' {
  import { EventEmitter } from 'node:events';

  export interface MetaArgument {
    type: string;
    value: unknown;
  }

  export interface OscMessage {
    address: string;
    args?: MetaArgument[];
  }

  export interface UDPPortOptions {
    localAddress?: string;
    localPort: number;
    remoteAddress?: string;
    remotePort?: number;
    metadata?: boolean;
  }

  export class UDPPort extends EventEmitter {
    constructor(options: UDPPortOptions);
    readonly options: UDPPortOptions;
    open(): void;
    close(): void;
    send(message: { address: string; args?: MetaArgument[] }): void;
  }

  const _default: {
    UDPPort: typeof UDPPort;
  };

  export { UDPPort };
  export default _default;
}
