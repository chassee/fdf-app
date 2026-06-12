import { useRef } from "react";

export function useComposition() {
  const isComposing = useRef(false);
  return {
    isComposing: isComposing.current,
    onCompositionStart: () => { isComposing.current = true; },
    onCompositionEnd: () => { isComposing.current = false; },
  };
}
