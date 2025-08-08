import React from "react";
import { removeStream, addModelToStream, removeModelFromStream } from "../api";
import "./StreamList.css";

function StreamList({ streams, onUpdate }) {
  const handleRemoveStream = async (streamId) => {
    try {
      await removeStream(streamId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to remove stream:", error);
      alert("Failed to remove stream. Please try again.");
    }
  };

  const handleAddModel = async (streamId, modelName) => {
    try {
      await addModelToStream(streamId, modelName);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to add model to stream:", error);
      alert("Failed to add model to stream. Please try again.");
    }
  };

  const handleRemoveModel = async (streamId, modelName) => {
    try {
      await removeModelFromStream(streamId, modelName);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to remove model from stream:", error);
      alert("Failed to remove model from stream. Please try again.");
    }
  };

  if (!streams || streams.length === 0) {
    return (
      <div className="no-streams">
        No active streams. Add a stream to get started.
      </div>
    );
  }

  return (
    <div className="stream-list">
      {streams.map((stream) => (
        <div key={stream.id} className="stream-card">
          <div className="stream-header">
            <h3>{stream.name}</h3>
            <div className="stream-actions">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveStream(stream.id)}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="stream-details">
            <div className="stream-info">
              <p>
                <strong>Source:</strong> {stream.source} ({stream.source_type})
              </p>
              <p>
                <strong>Status:</strong> {stream.active ? "Active" : "Inactive"}
              </p>
              {/* <p><strong>FPS:</strong> {stream.fps.toFixed(1)}</p> */}
              <p>
                <strong>Frames Processed:</strong> {stream.frame_count}
              </p>
            </div>

            <div className="stream-models">
              <h4>Models</h4>
              {stream.models.length === 0 ? (
                <p>No models attached</p>
              ) : (
                <ul>
                  {stream.models.map((model) => (
                    <li key={model}>
                      {model}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveModel(stream.id, model)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="add-model">
                <select id={`model-select-${stream.id}`}>
                  <option value="asset_detection">Asset Detection</option>
                  <option value="defect_analysis">Defect Analysis</option>
                </select>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const select = document.getElementById(
                      `model-select-${stream.id}`
                    );
                    handleAddModel(stream.id, select.value);
                  }}
                >
                  Add Model
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StreamList;
