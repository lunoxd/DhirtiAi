const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dhriti_token");
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("dhriti_token", token);
  } else {
    localStorage.removeItem("dhriti_token");
  }
}

export async function fetchApi(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "An error occurred with the request.");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Authentication API
export const apiAuth = {
  register: (name, email, password) =>
    fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),
  login: (email, password) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  me: () => fetchApi("/auth/me")
};

// Check-ins API
export const apiCheckIns = {
  submit: (structuredResponses, writtenResponses) =>
    fetchApi("/checkins", {
      method: "POST",
      body: JSON.stringify({ structuredResponses, writtenResponses })
    }),
  getHistory: () => fetchApi("/checkins/history"),
  getById: (id) => fetchApi(`/checkins/${id}`),
  deleteById: (id) =>
    fetchApi(`/checkins/${id}`, {
      method: "DELETE"
    }),
  deleteAll: () =>
    fetchApi("/checkins", {
      method: "DELETE"
    })
};

// Dhriti Index & Trend API
export const apiDhriti = {
  getCurrent: () => fetchApi("/dhriti/current"),
  getTrend: () => fetchApi("/dhriti/trend")
};

// Support Resources API
export const apiSupport = {
  getResources: () => fetchApi("/support/resources")
};
