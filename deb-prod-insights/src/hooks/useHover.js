import { useState, useCallback } from 'react';

/**
 * useHover — tracks whether an element is hovered.
 *
 * Usage:
 *   const { hovered, onMouseEnter, onMouseLeave } = useHover();
 *   <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
 */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  const onMouseEnter = useCallback(() => setHovered(true),  []);
  const onMouseLeave = useCallback(() => setHovered(false), []);
  return { hovered, onMouseEnter, onMouseLeave };
}
