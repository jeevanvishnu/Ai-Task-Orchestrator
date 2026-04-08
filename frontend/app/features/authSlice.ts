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
  loading: true, // Start with loading while we check the session
  error: null,
};

const BASE_URL = "http://localhost:4001/api/auth";

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
    const response = await fetchWithAuth(`${BASE_URL}/me`);
    const data = await response.json();
    if (!response.ok) return rejectWithValue(data.message || "Session expired");
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const refreshTokenAction = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/refresh`, {
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
    const response = await fetchWithAuth(`${BASE_URL}/register`, {
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
    const response = await fetchWithAuth(`${BASE_URL}/login`, {
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
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
      // refreshTokenAction
      .addCase(refreshTokenAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshTokenAction.rejected, (state) => {
        state.loading = false;
        // We don't necessarily want to log out on a failed refresh if it was just a background check
      })
      // registerUser
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
      // loginUser
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
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
