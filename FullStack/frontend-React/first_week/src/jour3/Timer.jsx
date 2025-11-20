import { useEffect, useState } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (time < 20) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [time]);
  return (
    <div style={{ margin: "auto", marginTop: "20px" }}>
      <h2>Temps écoulé : {time}</h2>
    </div>
  );
};

export default Timer;
