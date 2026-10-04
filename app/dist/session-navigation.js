// History receives opaque counters only. Route context stays in this tab's memory.
// No account values, institution names, passwords or notes enter URLs/history/storage.
const sessionToken=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`;
export function createSessionNavigation(history, onRestore, {token = sessionToken(), limit = 80} = {}) {
 let session = token, serial = 0, last = '', restoring = false;
 const routes = new Map();
 function sync(route) {
  if (restoring) return;
  const signature = JSON.stringify(route);
  if (signature === last) return;
  const first = !routes.size, id = ++serial;
  routes.set(id, structuredClone(route));
  while (routes.size > limit) routes.delete(routes.keys().next().value);
  try { history[first ? 'replaceState' : 'pushState']({virasatNavigation: session, id}, ''); }
  catch { /* In-app Back remains usable when browser history is unavailable. */ }
  last = signature;
 }
 function restore(state) {
  const route = state?.virasatNavigation === session && Number.isInteger(state.id) ? routes.get(state.id) : null;
  restoring = true;
  try { onRestore(route ? structuredClone(route) : {view: 'home'}); }
  finally { restoring = false; last = route ? JSON.stringify(route) : ''; }
 }
 function reset() {
  routes.clear(); last = ''; serial = 0; session = sessionToken();
 }
 return {sync, restore, reset};
}
