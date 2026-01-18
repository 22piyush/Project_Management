import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk("login", async (data, thunkApi) => {

  try {
    const res = await axiosInstance.post("/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    });
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkApi.rejectWithValue(error.response.data.message);
  }

});

export const forgotPassword = createAsyncThunk("forgotPassword", async (email, thunkApi) => {

  try {
    const res = await axiosInstance.post("/auth/password/forgot", email);
    toast.success(res.data.message);
    return null;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkApi.rejectWithValue(error.response.data.message);
  }

});

export const resetPassword = createAsyncThunk("resetPassword", async ({ token, password, confirmPassword }, thunkApi) => {

  try {
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, { password, confirmPassword });
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to reset password");
    return thunkApi.rejectWithValue(error.response.data.message);
  }

});

export const getUser = createAsyncThunk("getUser", async (_, thunkApi) => {

  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data.message || "Failed to fetch user");
  }

});

export const logout = createAsyncThunk("logout", async (_, thunkApi) => {

  try {
    const res = await axiosInstance.get("/auth/logout");
    return null;
  } catch (error) {
    toast.error(error.response.data.message || "Failed to logout user");
    return thunkApi.rejectWithValue(error.response.data.message || "Failed to logout user");
  }

});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    }).addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    }).addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    })
    .addCase(getUser.pending, (state) => {
      state.isCheckingAuth = true;
      // state.authUser = null;
    }).addCase(getUser.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload;
    }).addCase(getUser.rejected, (state) => {
      state.isCheckingAuth = false;
      state.authUser = null;
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.authUser = null;
    }).addCase(logout.rejected, () => {})
    // .addCase(logout.rejected, (state) => {
    //   state.authUser = state.authUser;
    // })
    .addCase(forgotPassword.pending, (state, action) => {
      state.isRequestingForToken = true;
    }).addCase(forgotPassword.fulfilled, (state, action) => {
     state.isRequestingForToken = false;
    }).addCase(forgotPassword.rejected, (state) => {
      state.isRequestingForToken = false;
    })
    .addCase(resetPassword.pending, (state, action) => {
      state.isUpdatingPassword = true;
    }).addCase(resetPassword.fulfilled, (state, action) => {
     state.isUpdatingPassword = false;
     state.authUser = action.payload;
    }).addCase(resetPassword.rejected, (state) => {
       state.isUpdatingPassword = false;
    });
  },
});

export default authSlice.reducer;
