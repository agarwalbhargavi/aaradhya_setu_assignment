const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

async function apiRequest(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Make sure the Express server is running on port 5001."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      result.message || `Request failed with status ${response.status}`
    );
  }

  return result;
}

export const bookingAPI = {
  getAll: () => apiRequest("/bookings"),

  getById: (bookingId) =>
    apiRequest(`/bookings/${encodeURIComponent(bookingId)}`),

  create: (bookingData) =>
    apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  updateStatus: (bookingId, status) =>
    apiRequest(
      `/bookings/${encodeURIComponent(bookingId)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    ),

  getNotifications: (bookingId) =>
    apiRequest(
      `/bookings/${encodeURIComponent(bookingId)}/notifications`
    ),
};