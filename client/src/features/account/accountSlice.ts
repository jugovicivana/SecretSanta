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
  pendingUsers: User[] | [];
}

const initialState: AccountState = {
  user: null,
  status: "idle",
  pendingUsers: [],
};

export const signInUser = createAsyncThunk<UserWithToken, LoginDto>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const response: UserTokenDto = await agent.Account.login(data);

      const userWithToken: UserWithToken = {
        ...response.user,
        accessToken: response.accessToken,
        expiresIn: response.expiresIn,
      };

      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } catch (error: any) {
      const message = error?.response?.data || "Pogrešan email ili lozinka.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk<User, RegisterDto>(
  "account/registerUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.register(data);
      return userDto;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
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
      const existingUser = localStorage.getItem("user");
      if (!existingUser) return null;
      
      const userWithToken: UserWithToken = {
        ...response.user,
        accessToken: response.accessToken,
        expiresIn: response.expiresIn
      };

      localStorage.setItem("user", JSON.stringify(userWithToken));
      return userWithToken;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Nije moguće pribaviti korisnika."
      );
    }
  }
);

export const rejectUser = createAsyncThunk<void, number>(
  "account/rejectUser",
  async (userId, thunkAPI) => {
    try {
      await agent.Account.rejectUser(userId);
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPendingUsers = createAsyncThunk<User[]>(
  "account/fetchPendingUsers",
  async (_, thunkAPI) => {
    try {
      const users = await agent.Account.getAllPendingUsers();
      return users;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveUser = createAsyncThunk<number, number>(
  "account/approveUser",
  async (id, thunkAPI) => {
    try {
      await agent.Account.approveUser(id);
      return id;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
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
      state.status = "successRegister";
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = "pendingRegister";
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.status = "successLogin";
      state.user = action.payload;
    });
    builder.addCase(signInUser.pending, (state) => {
      state.status = "pendingSignIn";
    });
    builder.addCase(signInUser.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = "rejectedFetchCurrentUser";
      state.user = null;
      localStorage.removeItem("user");
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.status = "pendingFetchCurrentUser";
    });

    builder.addCase(approveUser.rejected, (state) => {
      state.status = "rejectedApproveUser";
    });
    builder.addCase(approveUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pendingUsers = state.pendingUsers.filter(
        (a) => a.id != action.payload
      );
    });
    builder.addCase(approveUser.pending, (state) => {
      state.status = "pendingApproveUser";
    });
    builder.addCase(fetchPendingUsers.rejected, (state) => {
      state.status = "rejectedFetchPendingUsers";
    });
    builder.addCase(fetchPendingUsers.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.pendingUsers = action.payload;
    });
    builder.addCase(fetchPendingUsers.pending, (state) => {
      state.status = "pendingFetchPendingUsers";
    });
    builder.addCase(rejectUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      const rejectedUserId = action.meta.arg;
      state.pendingUsers = state.pendingUsers.filter(
        (a) => a.id !== rejectedUserId
      );
    });
    builder.addCase(rejectUser.pending, (state) => {
      state.status = "pendingRejectUser";
    });
    builder.addCase(rejectUser.rejected, (state) => {
      state.status = "failedRejectUser";
    });
  },
});

export const { setUser, signOut } = accountSlice.actions;
