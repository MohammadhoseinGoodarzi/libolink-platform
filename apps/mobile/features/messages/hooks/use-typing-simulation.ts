import { useEffect, useRef, useState } from 'react';

// Mock "is typing" presence (no backend yet): every few seconds a random
// eligible conversation starts typing for a couple of seconds, then stops — so
// the list feels live instead of carrying a hardcoded flag. Swap for real
// presence (websocket) when the backend exists; the UI reads the same Set.
export function useTypingSimulation(eligibleIds: string[]): Set<string> {
  const [typing, setTyping] = useState<Set<string>>(new Set());
  // Read the latest ids inside the interval without re-arming it every render.
  const idsRef = useRef(eligibleIds);
  idsRef.current = eligibleIds;

  useEffect(() => {
    let active = true;
    const stops: ReturnType<typeof setTimeout>[] = [];

    const tick = () => {
      const pool = idsRef.current;
      if (pool.length === 0) {
        return;
      }
      const id = pool[Math.floor(Math.random() * pool.length)];
      if (!id) {
        return;
      }
      setTyping((prev) => {
        if (prev.has(id)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      const stop = setTimeout(
        () => {
          if (!active) {
            return;
          }
          setTyping((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
        2500 + Math.random() * 2000,
      );
      stops.push(stop);
    };

    const interval = setInterval(tick, 5000);
    return () => {
      active = false;
      clearInterval(interval);
      for (const s of stops) {
        clearTimeout(s);
      }
    };
  }, []);

  return typing;
}
