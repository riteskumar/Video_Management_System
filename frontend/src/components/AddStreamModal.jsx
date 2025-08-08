import React, { useState } from "react";
import { addStream } from "../api";
import "./AddStreamModal.css";

function AddStreamModal({ onClose, onStreamAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    models: [],
  });
  const [sourceType, setSourceType] = useState("camera");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModelChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      models: checked
        ? [...prev.models, value]
        : prev.models.filter((model) => model !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let source = formData.source;
      if (sourceType === "camera" && !isNaN(source)) {
        source = parseInt(source, 10);
      }

      await addStream({
        name: formData.name,
        source: source.toString(),
        models: formData.models,
      });

      if (onStreamAdded) onStreamAdded();
    } catch (err) {
      setError(err.message || "Failed to add stream");
      console.error("Error adding stream:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Stream</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Stream Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter stream name"
              required
            />
          </div>

          <div className="form-group">
            <label>Source Type</label>
            <div className="source-type-options">
              <label>
                <input
                  type="radio"
                  name="sourceType"
                  value="camera"
                  checked={sourceType === "camera"}
                  onChange={() => setSourceType("camera")}
                />
                Camera
              </label>
              <label>
                <input
                  type="radio"
                  name="sourceType"
                  value="video"
                  checked={sourceType === "video"}
                  onChange={() => setSourceType("video")}
                />
                Video File
              </label>
              <label>
                <input
                  type="radio"
                  name="sourceType"
                  value="folder"
                  checked={sourceType === "folder"}
                  onChange={() => setSourceType("folder")}
                />
                Image Folder
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="source">
              {sourceType === "camera"
                ? "Camera ID"
                : sourceType === "video"
                ? "Video File Path"
                : "Image Folder Path"}
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder={
                sourceType === "camera"
                  ? "Enter camera ID (e.g., 0 for default webcam)"
                  : sourceType === "video"
                  ? "Enter video file path"
                  : "Enter image folder path"
              }
              required
            />
          </div>

          <div className="form-group">
            <label>AI Models</label>
            <div className="model-options">
              <label>
                <input
                  type="checkbox"
                  name="models"
                  value="asset_detection"
                  checked={formData.models.includes("asset_detection")}
                  onChange={handleModelChange}
                />
                Asset Detection
              </label>
              <label>
                <input
                  type="checkbox"
                  name="models"
                  value="defect_analysis"
                  checked={formData.models.includes("defect_analysis")}
                  onChange={handleModelChange}
                />
                Defect Analysis
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Stream"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStreamModal;
