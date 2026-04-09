import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, 
  error: null,
};

// Define all base URLs clearly
const API_ROOT = "https://ai-task-orchestrator-u46k.onrender.com/api";
const AUTH_URL = `${API_ROOT}/auth`;
const SETTINGS_URL = `${API_ROOT}/settings`;

// Helper to fetch with credentials (cookies)
const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: "include", // Ensure cookies are sent
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
};

export const checkAuth = createAsyncThunk("auth/check", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${AUTH_URL}/me`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Session expired");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const refreshTokenAction = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${AUTH_URL}/refresh`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Session expired");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${AUTH_URL}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Registration failed");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${AUTH_URL}/login`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Login failed");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${AUTH_URL}/logout`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Logout failed");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserSettings = createAsyncThunk("auth/fetchSettings", async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWithAuth(SETTINGS_URL);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch settings");
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
});

export const updateUserSettings = createAsyncThunk("auth/updateSettings", async (userData: { name: string, email: string }, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(SETTINGS_URL, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Update failed");
    return data.updatedUser;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      });
  }
});

export default authSlice.reducer;
