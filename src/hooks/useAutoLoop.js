import { useEffect, useRef } from 'react';

export function useAutoLoop(active, taskFn, delayMs = 2500) {
  const activeRef = useRef(false);
  const runningRef = useRef(false);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const loop = async () => {
      while (activeRef.current && !cancelled) {
        if (runningRef.current) { await new Promise(r => setTimeout(r, 500)); continue; }
        runningRef.current = true;
        try { await taskFn(); } catch (e) { console.error("[AutoLoop] Error:", e); }
        runningRef.current = false;
        await new Promise(r => setTimeout(r, delayMs));
      }
    };
    loop();
    return () => { cancelled = true; };
  }, [active]); // eslint-disable-line
}
