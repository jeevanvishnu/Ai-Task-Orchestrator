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
    }
})

export default goalSlice.reducer