import React, { useState, useEffect } from "react";
import AlertList from "../components/AlertList";
import { fetchAlerts } from "../api";
import "./AlertsPage.css";

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await fetchAlerts();
      setAlerts(data.alerts);
      setError(null);
    } catch (err) {
      setError("Failed to load alerts. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();


    const interval = setInterval(loadAlerts, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="alerts-page">
      <div className="page-header">
        <h1>System Alerts</h1>
        <button className="btn btn-secondary" onClick={loadAlerts}>
          Refresh
        </button>
      </div>

      {loading && <div className="loading">Loading alerts...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && <AlertList alerts={alerts} />}
    </div>
  );
}

export default AlertsPage;
