import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";

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
    loading: boolean;
    error: string | null;
}

const initialState: GoalState = {
    goals: [],
    loading: false,
    error: null,
}

export const getDashboard = createAsyncThunk(
    "goal/getDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:4001/api/dashboard", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
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
            const response = await fetch("http://localhost:4001/api/dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal: goalTitle }),
            });
            const data = await response.json();
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
            const response = await fetch("http://localhost:4001/api/goals", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
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
            const response = await fetch(`http://localhost:4001/api/goals/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
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
            const response = await fetch(`http://localhost:4001/api/goals/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            const data = await response.json();
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
            const response = await fetch(`http://localhost:4001/api/goals/${id}/regenerate`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
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

            const response = await fetch(`http://localhost:4001/api/goals/${id}/task/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return data.updatedTask;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const deleteGoal = createAsyncThunk(
    "goal/deleteGoal",
    async ({ id, taskId }: { id: string, taskId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:4001/api/goals/${id}/task/${taskId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
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
            const response = await fetch(`http://localhost:4001/api/goals/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            return data.deletedGoal;
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
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTask = action.payload;
        if (deletedTask && deletedTask._id) {
          const index = state.goals.findIndex(g => g._id === deletedTask._id);
          if (index !== -1) {
            state.goals[index] = deletedTask;
          }
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
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
    }
})

export default goalSlice.reducer