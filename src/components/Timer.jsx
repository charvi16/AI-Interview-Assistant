import { useEffect, useState } from "react";

function Timer({ seconds, onTimeout }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) {
      onTimeout();
      return;
    }
    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time]);

  return <p>⏳ {time}s left</p>;
}

export default Timer;
