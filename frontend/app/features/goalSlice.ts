import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface GoalSubTask {
    heading: string;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed";
}

export interface Goal {
    _id: string;
    title: string;
    goal: GoalSubTask[];
    createdAt: string;
}

export interface GoalState {
    goals: Goal[];
    history: {
        goals: Goal[];
        inprogress: Goal[];
        completed: Goal[];
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: GoalState = {
    goals: [],
    history: null,
    loading: false,
    error: null,
}

const BASE_URL = "http://localhost:4001/api";

const fetchWithAuth = (url: string, options: RequestInit = {}) => {
    return fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
        },
    });
};

export const getDashboard = createAsyncThunk(
    "goal/getDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/dashboard`);
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to fetch dashboard");
            return data.goals; 
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const createGoalAction = createAsyncThunk(
    "goal/createGoal",
    async (goalTitle: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/dashboard`, {
                method: "POST",
                body: JSON.stringify({ goal: goalTitle }),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to create goal");
            return data.tasks;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const getGoals = createAsyncThunk(
    "goal/getGoals",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals`);
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to fetch goals");
            return data.goals;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const getGoalById = createAsyncThunk(
    "goal/getGoalById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}`);
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to fetch goal");
            return data.goal;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const editGoalAction = createAsyncThunk(
    "goal/editGoal",
    async ({ id, title }: { id: string, title: string }, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title }),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to edit goal");
            return data.updatedGoal;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const regenerateGoal = createAsyncThunk(
    "goal/regenerateGoal",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}/regenerate`, {
                method: "PUT",
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to regenerate goal");
            return data.updatedGoal;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const editTask = createAsyncThunk(
    "goal/editTask",
    async ({ id, taskId, title, description, status }: { id: string, taskId: string, title?: string, description?: string, status?: string }, { rejectWithValue }) => {
        try {
            const body: any = {};
            if (title !== undefined) body.title = title;
            if (description !== undefined) body.description = description;
            if (status !== undefined) body.status = status;

            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}/task/${taskId}`, {
                method: "PUT",
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to edit task");
            return data.updatedTask;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteGoalAction = createAsyncThunk(
    "goal/deleteGoal",
    async ({ id, taskId }: { id: string, taskId: string }, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}/task/${taskId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to delete task");
            return data.deletedTask;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteDashboardGoal = createAsyncThunk(
    "goal/deleteDashboardGoal",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/goals/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to delete goal");
            return data.deletedGoal;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const getHistory = createAsyncThunk(
    "goal/getHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/history`);
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Failed to fetch history");
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const searchGoal = createAsyncThunk(
    "goal/searchGoal",
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth(`${BASE_URL}/search?query=${query}`);
            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || "Search failed");
            return data.goals;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

const goalSlice = createSlice({
    name: "goal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload || [];
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGoalAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGoalAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
             state.goals = [action.payload, ...state.goals];
        }
      })
      .addCase(createGoalAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload || [];
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getGoalById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGoalById.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedGoal = action.payload;
        if (fetchedGoal && fetchedGoal._id) {
          const index = state.goals.findIndex(g => g._id === fetchedGoal._id);
          if (index !== -1) {
            state.goals[index] = fetchedGoal;
          } else {
            state.goals.push(fetchedGoal);
          }
        }
      })
      .addCase(getGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editGoalAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(editGoalAction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGoal = action.payload;
        if (updatedGoal && updatedGoal._id) {
          const index = state.goals.findIndex(g => g._id === updatedGoal._id);
          if (index !== -1) {
            state.goals[index] = updatedGoal;
          } else {
            state.goals.push(updatedGoal);
          }
        }
      })
      .addCase(editGoalAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(regenerateGoal.pending, (state) => {
        state.loading = true;
      })
      .addCase(regenerateGoal.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGoal = action.payload;
        if (updatedGoal && updatedGoal._id) {
          const index = state.goals.findIndex(g => g._id === updatedGoal._id);
          if (index !== -1) {
            state.goals[index] = updatedGoal;
          } else {
            state.goals.push(updatedGoal);
          }
        }
      })
      .addCase(regenerateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        if (updatedTask && updatedTask._id) {
          const index = state.goals.findIndex(g => g._id === updatedTask._id);
          if (index !== -1) {
            state.goals[index] = updatedTask;
          } else {
            state.goals.push(updatedTask);
          }
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGoalAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGoalAction.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTask = action.payload;
        if (deletedTask && deletedTask._id) {
          const index = state.goals.findIndex(g => g._id === deletedTask._id);
          if (index !== -1) {
            state.goals[index] = deletedTask;
          }
        }
      })
      .addCase(deleteGoalAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDashboardGoal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDashboardGoal.fulfilled, (state, action) => {
        state.loading = false;
        const deletedGoal = action.payload;
        if (deletedGoal && deletedGoal._id) {
          state.goals = state.goals.filter(g => g._id !== deletedGoal._id);
        }
      })
      .addCase(deleteDashboardGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload || null;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(searchGoal.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload || [];
      })
      .addCase(searchGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    }
})

export default goalSlice.reducer