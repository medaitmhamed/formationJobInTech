import { useEffect, useRef, useState } from "react";

const PreviouceValue = () => {
  const [value, setValue] = useState("");
  const prevValue = useRef("");
  useEffect(() => {
    // update previous value only when value changes
    prevValue.current = value;
  }, [value]);
  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <p>Current value: {value}</p>
      <p>Previous value: {prevValue.current}</p>
    </div>
  );
};

export default PreviouceValue;
