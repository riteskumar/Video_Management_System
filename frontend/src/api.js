const API_BASE_URL = "http://127.0.0.1:5000/api";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }));
    throw new Error(
      error.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}


export const fetchStreams = () => {
  return apiRequest("/streams");
};

export const addStream = (streamData) => {
  return apiRequest("/streams", {
    method: "POST",
    body: JSON.stringify(streamData),
  });
};

export const removeStream = (streamId) => {
  return apiRequest(`/streams/${streamId}`, {
    method: "DELETE",
  });
};

export const fetchStreamResults = (streamId) => {
  return apiRequest(`/results/${streamId}`);
};

export const fetchAlerts = () => {
  return apiRequest("/alerts");
};

export const addModelToStream = (streamId, modelName) => {
  return apiRequest(`/streams/${streamId}/models`, {
    method: "POST",
    body: JSON.stringify({ model: modelName }),
  });
};

export const removeModelFromStream = (streamId, modelName) => {
  return apiRequest(`/streams/${streamId}/models/${modelName}`, {
    method: "DELETE",
  });
};
