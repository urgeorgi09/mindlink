import React from "react";
import AIJournal from "../components/AIJournal";

export default function Journal() {
    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "0 auto",
                padding: "40px 20px",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "16px",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
                    animation: "fadeIn 0.4s ease",
                }}
            >
                <AIJournal />
            </div>

            <style>
                {`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
}
