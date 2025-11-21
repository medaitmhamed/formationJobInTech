import { useState } from "react";

const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggleValue = () => setValue(!value);
    return [value, toggleValue];
  };
export default useToggle;