/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { router } from "../../app/router/Routes";
import agent from "../../app/api/agent";
import type {
  LoginDto,
  RegisterDto,
  User,
  UserTokenDto,
  UserWithToken,
} from "../../app/models/user";

interface AccountState {
  user: UserWithToken | null;
  status: string;
  pendingAdmins: User[] | [];
}

const initialState: AccountState = {
  user: null,
  status: "idle",
  pendingAdmins: [],
};

export const signInUser = createAsyncThunk<UserWithToken, LoginDto>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const response: UserTokenDto = await agent.Account.login(data);
      const userWithToken: UserWithToken = {
        ...response.user,
        token: response.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUser = createAsyncThunk<RegisterDto, RegisterDto>(
  "account/registerUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.register(data);
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
export const fetchCurrentUser = createAsyncThunk<UserWithToken | null>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response: UserTokenDto = await agent.Account.currentUser();
      if (!response) {
        localStorage.removeItem("user");
        return null;
      }
      const userWithToken: UserWithToken = {
        ...response.user,
        token: response.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Could not fetch user"
      );
    }
  }
);

export const rejectAdmin = createAsyncThunk<void, number>(
  "account/rejectAdmin",
  async (userId, thunkAPI) => {
    try {
      await agent.Account.rejectAdmin(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchPendingAdmins = createAsyncThunk<User[]>(
  "account/fetchPendingAdmins",
  async (_, thunkAPI) => {
    try {
      const users = await agent.Account.getAllPendingAdmins();
      return users;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const approveAdmin = createAsyncThunk<number, number>(
  "account/approveAdmin",
  async (id, thunkAPI) => {
    try {
      await agent.Account.approveAdmin(id);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = "pendingRegister";
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
    });
    builder.addCase(signInUser.pending, (state) => {
      state.status = "pendingSignIn";
    });
    builder.addCase(signInUser.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "pendingFetchCurrentUser";
    });

    builder.addCase(approveAdmin.rejected, (state) => {
      state.status = "rejectedApproveAdmin";
    });
    builder.addCase(approveAdmin.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pendingAdmins = state.pendingAdmins.filter(
        (a) => a.id != action.payload
      );
    });
    builder.addCase(approveAdmin.pending, (state) => {
      state.status = "pendingApproveAdmin";
    });
    builder.addCase(fetchPendingAdmins.rejected, (state) => {
      state.status = "rejectedFetchPendingAdmins";
    });
    builder.addCase(fetchPendingAdmins.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pendingAdmins = action.payload;
    });
    builder.addCase(fetchPendingAdmins.pending, (state) => {
      state.status = "pendingFetchPendingAdmins";
    });
    builder.addCase(rejectAdmin.fulfilled, (state, action) => {
      state.status = "succeeded";
      const rejectedUserId = action.meta.arg;
      state.pendingAdmins = state.pendingAdmins.filter(
        (a) => a.id !== rejectedUserId
      );
    });
    builder.addCase(rejectAdmin.pending, (state) => {
      state.status = "pendingRejectAdmin";
    });
    builder.addCase(rejectAdmin.rejected, (state) => {
      state.status = "failedRejectAdmin";
    });
  },
});

export const { setUser, signOut } = accountSlice.actions;
