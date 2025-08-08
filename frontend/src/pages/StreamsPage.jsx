import React, { useState, useEffect } from "react";
import StreamList from "../components/StreamList";
import AddStreamModal from "../components/AddStreamModal";
import { fetchStreams } from "../api";
import "./StreamsPage.css";

function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const data = await fetchStreams();
      setStreams(data.streams);
      setError(null);
    } catch (err) {
      setError("Failed to load streams. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();

    // Set up polling for updates
    const interval = setInterval(loadStreams, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="streams-page">
      <div className="page-header">
        <h1>Video Streams</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New Stream
        </button>
      </div>

      {loading && <div className="loading">Loading streams...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <StreamList streams={streams} onUpdate={loadStreams} />
      )}

      {showAddModal && (
        <AddStreamModal
          onClose={() => setShowAddModal(false)}
          onStreamAdded={() => {
            setShowAddModal(false);
            loadStreams();
          }}
        />
      )}
    </div>
  );
}

export default StreamsPage;
