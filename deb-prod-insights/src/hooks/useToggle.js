import { useState, useCallback } from 'react';

/**
 * useToggle — clean boolean toggle with named actions.
 *
 * Usage:
 *   const { state: open, toggle, setOn, setOff } = useToggle(false);
 */
export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = useCallback(() => setState(s => !s), []);
  const setOn   = useCallback(() => setState(true),  []);
  const setOff  = useCallback(() => setState(false), []);
  return { state, toggle, setOn, setOff };
}
