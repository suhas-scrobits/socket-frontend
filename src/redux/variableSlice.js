import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  data: null,
  xAxisData: null,
  yAxisData: null,
  error: "",
};

const headers = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzAsInJvbGUiOjAsIm9yZ0lkIjo0LCJpc1ZlcmlmaWVkIjp0cnVlLCJpYXQiOjE2OTM2NDYzNTUsImV4cCI6MTY5MzczMjc1NX0.BHEesk_YpH9sbMqVdMqR611yu5_Mw39tc-x2ezBImy0`,
};

export const fetchVariableById = createAsyncThunk(
  "variable/fetchVariableById",
  async () => {
    const res = await axios.get(
      "https://sisai-backend-production.up.railway.app/api/v1/variables/47",
      {
        headers,
      }
    );

    return res.data;
  }
);

const variableSlice = createSlice({
  name: "variableSlice",
  initialState,
  reducers: {
    addChartData: (state, action) => {
      state.xAxisData = [...state.xAxisData, action.payload.timestamp];
      state.yAxisData = [...state.yAxisData, action.payload.value];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVariableById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchVariableById.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.xAxisData = action.payload.data.values.map(
        (value) => value.timestamp
      );
      state.yAxisData = action.payload.data.values.map((value) => value.value);
    });
    builder.addCase(fetchVariableById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default variableSlice.reducer;
export const { addChartData } = variableSlice.actions;
