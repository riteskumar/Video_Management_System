import React from "react";
import "./AlertList.css";

function AlertList({ alerts, limit }) {
  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;

  if (!alerts || alerts.length === 0) {
    return <div className="no-alerts">No alerts to display.</div>;
  }

  return (
    <div className="alert-list">
      {displayAlerts.map((alert, index) => (
        <div
          key={index}
          className={`alert-item alert-${alert.level || "info"}`}
        >
          <div className="alert-header">
            <span className="alert-timestamp">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            <span
              className={`alert-level alert-level-${alert.level || "info"}`}
            >
              {alert.level || "info"}
            </span>
          </div>
          <div className="alert-message">{alert.message}</div>
          {alert.stream_id && (
            <div className="alert-stream">Stream: {alert.stream_id}</div>
          )}
          {alert.details && (
            <div className="alert-details">
              <button
                className="btn btn-sm btn-outline"
                onClick={(e) => {
                  const details = e.target.nextElementSibling;
                  details.style.display =
                    details.style.display === "none" ? "block" : "none";
                  e.target.textContent =
                    details.style.display === "none"
                      ? "Show Details"
                      : "Hide Details";
                }}
              >
                Show Details
              </button>
              <pre style={{ display: "none" }}>
                {JSON.stringify(alert.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AlertList;
