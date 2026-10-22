import { asset } from './assets.js';
import { useEffect, useState } from 'react';
// Signature / layout / contact data ship as JSON assets (public/assets/cyberdesk/data) and are fetched once.
const cache = {};
const get = (name) => (cache[name] ||= fetch(asset(`data/${name}.json`)).then((r) => r.json()).catch(() => []));
export function useAssetData(name) {
  const [v, setV] = useState(cache[name + ':v'] || null);
  useEffect(() => { let on = true; get(name).then((d) => { cache[name + ':v'] = d; if (on) setV(d); }); return () => { on = false; }; }, [name]);
  return v;
}
