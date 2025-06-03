import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// Async thunk để lấy trạng thái điểm danh
export const fetchAttendanceStatus = createAsyncThunk(
  "attendance/fetchStatus",
  async ({ userId, accessToken }) => {
    const res = await axios.get(`${baseURL}/attendance/status?userId=${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log("Attendance status response:", res.data);
    return res.data;
  }
);

// Async thunk để điểm danh
export const checkInAttendance = createAsyncThunk(
  "attendance/checkIn",
  async ({ userId, accessToken }) => {
    const res = await axios.post(`${baseURL}/attendance/check-in`, { userId }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return res.data;
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    checkedInToday: false,
    totalPoints: 0,
    streak: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetAttendance: (state) => {
      state.checkedInToday = false;
      state.totalPoints = 0;
      state.streak = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý fetchAttendanceStatus
      .addCase(fetchAttendanceStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.checkedInToday = action.payload.checkedInToday;
        state.totalPoints = action.payload.totalPoints;
        state.streak = action.payload.streak;
      })
      .addCase(fetchAttendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Xử lý checkInAttendance
      .addCase(checkInAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkInAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.checkedInToday = true;
        state.totalPoints = action.payload.totalPoints;
        state.streak = action.payload.streak;
      })
      .addCase(checkInAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;