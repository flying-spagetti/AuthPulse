import React, { useEffect, useState } from "react";

interface BackendInfo {
  language: string;
  framework: string;
  port: number;
  secure: boolean;
  jwt: string;
  passwordHash: string;
  ulid: boolean;
  env: string;
}

export default function StatusBar() {
  const [info, setInfo] = useState<BackendInfo | null>(null);
  const [activePort, setActivePort] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const pingBackends = async () => {
    const backends = [3000, 8080];

    for (const port of backends) {
      try {
        const res = await fetch(`http://localhost:${port}/api/info`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setInfo(data);
          setActivePort(port);
          return;
        }
      } catch (err) {
        console.warn(`Backend at port ${port} not reachable.`);
      }
    }

    setError("No backend is currently available.");
  };

  useEffect(() => {
    pingBackends();
  }, []);

  if (error) return <div className="status-bar error">{error}</div>;
  if (!info) return <div className="status-bar">🔎 Probing for backend...</div>;

  return (
    <div className="status-bar">
    <p>✅ Connected to <strong>{info.language}</strong> ({info.framework})</p>
    <ul>
      <li>🌐 Port: <strong>{activePort}</strong></li>
      <li>🔐 JWT Enabled: <strong>{info.jwt}</strong></li>
      <li>🧂 Hash: <strong>{info.passwordHash}</strong></li>
      <li>🆔 ULID: <strong>{info.ulid ? "Yes" : "No"}</strong></li>
      <li>🧪 Env: <strong>{info.env || "development"}</strong></li>
      <li>🔒 Secure Cookies: <strong>{info.secure ? "Yes" : "No"}</strong></li>
    </ul>
  </div>
  );
}
