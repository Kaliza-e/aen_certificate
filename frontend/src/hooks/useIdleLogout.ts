import { useCallback, useEffect, useRef, useState } from 'react';

export const IDLE_LIMIT_MS = 10 * 60 * 1000;
const WARNING_MS = 60 * 1000;
const THROTTLE_MS = 1000;

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
] as const;

export function useIdleLogout(onIdle: () => void, active: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const lastActivityRef = useRef(Date.now());
  const warningRef = useRef(false);
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const setWarning = useCallback((value: boolean) => {
    warningRef.current = value;
    setShowWarning(value);
  }, []);

  const staySignedIn = useCallback(() => {
    lastActivityRef.current = Date.now();
    setWarning(false);
    setSecondsLeft(0);
  }, [setWarning]);

  useEffect(() => {
    if (!active) {
      setWarning(false);
      setSecondsLeft(0);
      return;
    }

    lastActivityRef.current = Date.now();
    setWarning(false);

    let throttledUntil = 0;
    const handleActivity = () => {
      if (warningRef.current) return;
      const now = Date.now();
      if (now - throttledUntil < THROTTLE_MS) return;
      throttledUntil = now;
      lastActivityRef.current = now;
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = IDLE_LIMIT_MS - elapsed;

      if (remaining <= 0) {
        window.clearInterval(interval);
        setWarning(false);
        onIdleRef.current();
        return;
      }

      if (remaining <= WARNING_MS) {
        if (!warningRef.current) setWarning(true);
        setSecondsLeft(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [active, setWarning]);

  return { showWarning, secondsLeft, staySignedIn };
}