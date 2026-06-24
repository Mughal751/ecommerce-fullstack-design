import { useState, useEffect } from 'react';

// Shared end-time so Home and Deals show the same countdown
let sharedEndTime = null;

export function useCountdown(targetHours = 23) {
  if (!sharedEndTime) {
    sharedEndTime = Date.now() + targetHours * 3600 * 1000;
  }
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, sharedEndTime - Date.now());
      setTimeLeft({
        hours:   Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export function CountdownDisplay({ timeLeft }) {
  return (
    <div className="flex gap-2">
      {[
        { label: 'Hours',   value: timeLeft.hours   },
        { label: 'Mins',    value: timeLeft.minutes  },
        { label: 'Secs',    value: timeLeft.seconds  },
      ].map(t => (
        <div key={t.label} className="bg-gray-900 text-white rounded-lg px-3 py-2 text-center min-w-[56px]">
          <div className="text-2xl font-bold tabular-nums">{String(t.value).padStart(2, '0')}</div>
          <div className="text-xs text-gray-400">{t.label}</div>
        </div>
      ))}
    </div>
  );
}