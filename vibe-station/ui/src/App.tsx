import { useEffect, useRef, useState } from 'react';

interface TransportStatus {
  playing: boolean;
  bar: number;
  cpu: number;
}

interface TrackMeter {
  [id: string]: number;
}

interface StatusMessage {
  type: 'status';
  payload: TransportStatus;
}

interface MeterMessage {
  type: 'meters';
  payload: { master: number; tracks: TrackMeter };
}

interface ScenesMessage {
  type: 'scenes';
  payload: string[];
}

type IncomingMessage = StatusMessage | MeterMessage | ScenesMessage;

export function App(): JSX.Element {
  const [status, setStatus] = useState<TransportStatus>({ playing: false, bar: 0, cpu: 0 });
  const [scenes, setScenes] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:7777');
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const message: IncomingMessage = JSON.parse(event.data.toString());
        if (message.type === 'status') setStatus(message.payload);
        if (message.type === 'meters') {
          // no-op placeholder for meters yet
        }
        if (message.type === 'scenes') setScenes(message.payload);
      } catch (err) {
        console.error(err);
      }
    };
    return () => ws.close();
  }, []);

  const send = (payload: unknown) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui', padding: '1rem', color: '#0f172a', background: '#e2e8f0' }}>
      <h1>vibe-station</h1>
      <p>BPM, swing, scenes, and macros coming soon.</p>

      <section>
        <h2>Transport</h2>
        <button onClick={() => send({ type: 'transport', payload: { cmd: 'play' } })}>Play</button>
        <button onClick={() => send({ type: 'transport', payload: { cmd: 'pause' } })}>Pause</button>
        <button onClick={() => send({ type: 'transport', payload: { cmd: 'stop' } })}>Stop</button>
        <div>
          <strong>Status:</strong> {status.playing ? 'Playing' : 'Stopped'} / Bar {status.bar} / CPU {status.cpu.toFixed(1)}%
        </div>
      </section>

      <section>
        <h2>Scenes</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {scenes.map((scene) => (
            <button
              key={scene}
              onClick={() => send({ type: 'scene', payload: { name: scene } })}
            >
              {scene}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
