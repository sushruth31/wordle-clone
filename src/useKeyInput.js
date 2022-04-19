import { useEffect, useRef, useState } from "react";

export default function useKeyInput() {
  const [keyEvent, setKey] = useState(null);
  const [isEnterPressed, setIsEnter] = useState(false);
  const ref = useRef(null);

  ref.current = e => {
    setIsEnter(false);
    setKey(e);
    if (e.key === "Enter") {
      setIsEnter(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", ref.current);
    return () => window.removeEventListener("keydown", ref.current);
  }, []);

  return { keyEvent, isEnterPressed };
}
