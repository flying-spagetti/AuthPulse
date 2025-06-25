import React from "react";

interface StatusBarProps {
    activeService: string | null;
}

export default function StatusBar({ activeService }: StatusBarProps) {
    return (
        <div className="status-bar">
            <strong>Active Backend Service: </strong>
            {activeService ? (
                <span style={{ color: "limegreen" }}>{activeService}</span>
            ) : (
                <span style={{ color: "gray" }}>No service detected</span>
            )}
        </div>
    );
}
