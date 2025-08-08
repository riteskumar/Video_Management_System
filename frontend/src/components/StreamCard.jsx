import React from "react";

const StreamCard = ({ streamId, isActive }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        backgroundColor: isActive ? "#e7ffe7" : "#ffe7e7",
      }}
    >
      <h3>{streamId}</h3>
      <p>Status: {isActive ? "🟢 Active" : "🔴 Inactive"}</p>
    </div>
  );
};

export default StreamCard;
