// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get API URL based on environment
export const getApiUrl = () => {
  if (import.meta.env.MODE === "production") {
    return import.meta.env.VITE_API_URL_PROD || API_URL;
  }
  return API_URL;
};

// API Client with error handling
class ApiClient {
  constructor() {
    this.baseURL = getApiUrl();
    this.token = localStorage.getItem("authToken");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add auth token if available
    if (this.token && !options.skipAuth) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      //   console.log(`API Request: ${config.method || "GET"} ${url}`);

      const response = await fetch(url, config);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Server returned non-JSON response: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error Details:", {
        url,
        method: config.method || "GET",
        error: error.message,
        stack: error.stack,
      });

      // Make error message more user-friendly
      if (error.message === "Failed to fetch") {
        error.message =
          "Cannot connect to server. Please check if backend is running.";
      }

      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "GET",
    });
  }

  // POST request
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  // Update token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }

  // Get stored token
  getToken() {
    return this.token || localStorage.getItem("authToken");
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post(
      "/users/login",
      { email, password },
      { skipAuth: true }
    );

    if (response.success && response.data.token) {
      // Store token
      apiClient.setToken(response.data.token);

      // Store user data
      localStorage.setItem("userData", JSON.stringify(response.data.user));
    }

    return response;
  },

  register: async (name, email, password, role = "user") => {
    const response = await apiClient.post(
      "/users/register",
      {
        name,
        email,
        password,
        role,
      },
      { skipAuth: true }
    );

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
    }

    return response;
  },

  getProfile: async () => {
    return apiClient.get("/users/profile");
  },

  logout: () => {
    apiClient.clearToken();
    localStorage.removeItem("userData");
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("userData");
    const token = apiClient.getToken();

    if (!userData || !token) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!apiClient.getToken();
  },

  isAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user && user.role === "admin";
  },
};

// Projects API
export const projectsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/projects${queryString ? `?${queryString}` : ""}`);
  },

  getFeatured: () => apiClient.get("/projects/featured"),

  getById: (id) => apiClient.get(`/projects/${id}`),

  create: (data) => apiClient.post("/projects", data),

  update: (id, data) => apiClient.put(`/projects/${id}`, data),

  delete: (id) => apiClient.delete(`/projects/${id}`),

  toggleFeatured: (id) => apiClient.post(`/projects/${id}/featured`),
};

// Experiences API
export const experiencesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/experiences${queryString ? `?${queryString}` : ""}`);
  },

  getCurrent: () => apiClient.get("/experiences/current"),

  getTimeline: () => apiClient.get("/experiences/timeline"),

  getById: (id) => apiClient.get(`/experiences/${id}`),

  create: (data) => apiClient.post("/experiences", data),

  update: (id, data) => apiClient.put(`/experiences/${id}`, data),

  updateOrder: (experiences) =>
    apiClient.put("/experiences/reorder", { experiences }),

  delete: (id) => apiClient.delete(`/experiences/${id}`),
};

// Messages API
export const messagesAPI = {
  send: (data) => apiClient.post("/messages", data, { skipAuth: true }),

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/messages${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => apiClient.get(`/messages/${id}`),

  updateStatus: (id, status, adminNotes = "", tags = []) =>
    apiClient.post(`/messages/${id}/status`, { status, adminNotes, tags }),

  toggleStar: (id) => apiClient.post(`/messages/${id}/star`),

  delete: (id) => apiClient.delete(`/messages/${id}`),

  getStats: () => apiClient.get("/messages/stats"),
};

// Feedback API
export const feedbackAPI = {
  getPublic: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/feedback${queryString ? `?${queryString}` : ""}`, {
      skipAuth: true,
    });
  },

  submit: (rating) =>
    apiClient.post("/feedback", { rating }, { skipAuth: true }),

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(
      `/feedback/admin/all${queryString ? `?${queryString}` : ""}`
    );
  },

  getStats: () => apiClient.get("/feedback/admin/stats"),

  delete: (id) => apiClient.delete(`/feedback/${id}`),
};

// Analytics API
export const analyticsAPI = {
  track: (data) => apiClient.post("/visits/track", data, { skipAuth: true }),

  getAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(
      `/visits/analytics${queryString ? `?${queryString}` : ""}`
    );
  },

  getRealtime: () => apiClient.get("/visits/realtime"),

  getTrends: (period = "30d") =>
    apiClient.get(`/visits/trends?period=${period}`),
};

export default apiClient;
