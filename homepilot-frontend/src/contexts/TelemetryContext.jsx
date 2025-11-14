import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { fetchStatus } from "../lib/api";

const TelemetryContext = createContext();

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error("useTelemetry must be inside TelemetryProvider");
  return ctx;
}

export function TelemetryProvider({ children }) {
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    const socket = getSocket();
    const onTelemetry = (msg) => {
      if (!msg || !msg.deviceId) return;
      setTelemetry(prev => ({ ...prev, [msg.deviceId]: msg.payload }));
    };
    const onAlert = (a) => { console.warn("Alert:", a); };

    socket.on("telemetry", onTelemetry);
    socket.on("alert", onAlert);
    return () => {
      socket.off("telemetry", onTelemetry);
      socket.off("alert", onAlert);
    };
  }, []);

  async function subscribeDevice(deviceId) {
    const socket = getSocket();
    socket.emit("join", deviceId);
    const status = await fetchStatus(deviceId);
    if (status) {
      const payload = status.payload ?? status;
      setTelemetry(prev => ({ ...prev, [deviceId]: payload }));
    }
  }

  async function sendCmd(deviceId, cmd) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:3000"}/api/devices/${deviceId}/cmd`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cmd)
    });
    return res.json();
  }

  return (
    <TelemetryContext.Provider value={{ telemetry, subscribeDevice, sendCmd }}>
      {children}
    </TelemetryContext.Provider>
  );
}
