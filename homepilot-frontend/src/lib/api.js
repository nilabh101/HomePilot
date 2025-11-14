export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function fetchStatus(deviceId){
  try {
    const r = await fetch(`${API_BASE}/api/devices/${deviceId}/status`);
    if(!r.ok) return null;
    return r.json();
  } catch(e){
    console.error("fetchStatus error:", e);
    return null;
  }
}

export async function postCommand(deviceId, cmd){
  try {
    const r = await fetch(`${API_BASE}/api/devices/${deviceId}/cmd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cmd)
    });
    return r.json();
  } catch(e) {
    console.error("postCommand error:", e);
    throw e;
  }
}
