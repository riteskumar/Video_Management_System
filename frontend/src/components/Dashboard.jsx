import React, { useState, useEffect } from "react";
import StreamList from "./StreamList";
import AlertList from "./AlertList";
import AddStreamModal from "./AddStreamModal";
import { fetchStreams, fetchAlerts } from "../api";
import "./Dashboard.css";

function Dashboard() {
  const [streams, setStreams] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({
    totalStreams: 0,
    activeStreams: 0,
    totalAlerts: 0,
    processingRate: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    loadData(true);

    const interval = setInterval(() => loadData(false), 1000);
    return () => clearInterval(interval);
  }, []);
  const loadData = async (isInitialLoad = true) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const [streamsData, alertsData] = await Promise.all([
        fetchStreams(),
        fetchAlerts(),
      ]);

      setStreams(streamsData.streams || []);
      setAlerts(alertsData.alerts || []);

      const activeStreams = streamsData.streams
        ? streamsData.streams.filter((stream) => stream.active).length
        : 0;

      setError(null);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("(Backend Issue) Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAddStream = () => {
    setShowAddModal(true);
  };

  const handleStreamAdded = async () => {
    setShowAddModal(false);
    setLoading(true);
  };
  const handleManualRefresh = () => {
    loadData(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Video Management System</h1>
        <div className="dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-primary" onClick={handleAddStream}>
            Add Stream
          </button>
        </div>
      </div>

      {loading && !streams.length && (
        <div className="loading">Loading data...</div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalStreams}</div>
              <div className="stat-label">Total Streams</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeStreams}</div>
              <div className="stat-label">Active Streams</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalAlerts}</div>
              <div className="stat-label">Total Alerts</div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>Active Streams ({streams.length})</h2>
              {streams.length > 0 ? (
                <StreamList streams={streams} onUpdate={handleStreamAdded} />
              ) : (
                <div className="no-streams">
                  No active streams. Add stream
                </div>
              )}
            </div>

            <div className="dashboard-section">
              <h2>Recent Alerts ({alerts.length})</h2>
              {alerts.length > 0 ? (
                <AlertList alerts={alerts.slice(0, 5)} />
              ) : (
                <div className="no-alerts">No alerts</div>
              )}
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <AddStreamModal
          onClose={() => setShowAddModal(false)}
          onStreamAdded={handleStreamAdded}
        />
      )}
    </div>
  );
}

export default Dashboard;
