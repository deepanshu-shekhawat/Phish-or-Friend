import { useEffect } from 'react';
// Reference-counted busy flag: while any component reports busy, the .cyberdesk root animates the wait cursor.
let count = 0;
function apply() { document.querySelectorAll('.cyberdesk').forEach(el => el.classList.toggle('busy', count > 0)); }
export function useBusyCursor(active) {
  useEffect(() => {
    if (!active) return undefined;
    count++; apply();
    return () => { count = Math.max(0, count - 1); apply(); };
  }, [active]);
}
