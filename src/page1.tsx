import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "./Status";


export default function Page1() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/protected", {
          method: "GET",
          credentials: "include", // This sends the cookie
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        console.log("✅ Protected content:", data.message);
      } catch (err) {
        console.error("❌ Not authorized", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <div>
        <h1>Welcome Back User</h1>
        <StatusBar/>
    </div>
  );
}
