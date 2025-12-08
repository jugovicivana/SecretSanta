import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import type { Pair, YearPairs } from "../../app/models/pair";

interface GiftState {
  currentYearPairs: Pair[] | null;
  yearPairs: YearPairs[];
  selectedYear: number | null;
  status: string;
  statusOnePair: string;
  statusPairs: string;
  availableYears: number[] | null;
  myPairs: Pair[] | null;
  myCurrentPair: Pair | null;
  currentYearPairsStatus: string;
}

const initialState: GiftState = {
  currentYearPairs: null,
  yearPairs: [],
  selectedYear: null,
  status: "idle",
  statusPairs: "idle",
  statusOnePair: "idle",
  availableYears: [],
  myPairs: null,
  myCurrentPair: null,
  currentYearPairsStatus: "idle",
};
export const fetchCurrentYearPairs = createAsyncThunk<Pair[]>(
  "gift/fetchCurrentYearPairs",
  async (_, thunkAPI) => {
    try {
      const pairs = await agent.Gift.getCurrentYearPairs();
      return pairs;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMyPairs = createAsyncThunk<Pair[]>(
  "gift/fetchMyPairs",
  async (_, thunkAPI) => {
    try {
      const pairs = await agent.Gift.getMyPairs();
      return pairs;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMyPair = createAsyncThunk<Pair>(
  "gift/fetchMyPair",
  async (_, thunkAPI) => {
    try {
      const pair = await agent.Gift.getMyPair();
      return pair;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const generatePairs = createAsyncThunk(
  "gift/generatePairs",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Gift.generatePairs();
      return response.pairs;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetCurrentYearPairs = createAsyncThunk(
  "gift/resetCurrentYearPairs",
  async (_, thunkAPI) => {
    try {
      await agent.Gift.resetCurrentYearPairs();
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPairsForYear = createAsyncThunk<Pair[], number>(
  "gift/fetchPairsForYear",
  async (year, thunkAPI) => {
    try {
      const pairs = await agent.Gift.getPairsForYear(year);
      return pairs;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAllPairs = createAsyncThunk<Pair[]>(
  "gift/fetchAllPairs",
  async (_, thunkAPI) => {
    try {
      const pairs = await agent.Gift.getPairs();
      return pairs;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchYears = createAsyncThunk<number[]>(
  "gift/years",
  async (_, thunkAPI) => {
    try {
      const years = await agent.Gift.getAvailableYears();
      return years;
    } catch (error: any) {
      const message =
        error?.response?.data || error?.message || "Došlo je do greške.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const giftSlice = createSlice({
  name: "gift",
  initialState,
  reducers: {
    setSelectedYear: (state, action) => {
      state.selectedYear = action.payload;
    },
    clearSelectedYear: (state) => {
      state.selectedYear = null;
    },
    cacheYearPairs: (state, action) => {
      const { year, pairs } = action.payload;
      const existingIndex = state.yearPairs.findIndex((yp) => yp.year === year);

      if (existingIndex >= 0) {
        state.yearPairs[existingIndex].pairs = pairs;
      } else {
        state.yearPairs.push({ year, pairs });
      }
    },
    removeYearPairs: (state, action) => {
      const year = action.payload;
      state.yearPairs = state.yearPairs.filter((yp) => yp.year !== year);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentYearPairs.pending, (state) => {
        state.currentYearPairsStatus = "pendingFetchPairs";
      })
      .addCase(fetchCurrentYearPairs.fulfilled, (state, action) => {
        state.currentYearPairs = action.payload;
        state.currentYearPairsStatus = "pairsdone";
      })
      .addCase(fetchCurrentYearPairs.rejected, (state) => {
        state.currentYearPairsStatus = "failed";
      })
      .addCase(fetchMyPairs.pending, (state) => {
        state.statusPairs = "pendingFetchMyPairs";
      })
      .addCase(fetchMyPairs.fulfilled, (state, action) => {
        state.myPairs = action.payload;
        state.statusPairs = "idle";
      })
      .addCase(fetchMyPairs.rejected, (state) => {
        state.statusPairs = "idle";
      })
      .addCase(fetchMyPair.pending, (state) => {
        state.statusOnePair = "pendingFetchMyPair";
      })
      .addCase(fetchMyPair.fulfilled, (state, action) => {
        state.myCurrentPair = action.payload;
        state.statusOnePair = "idle";
      })
      .addCase(fetchMyPair.rejected, (state) => {
        state.statusOnePair = "idle";
      })
      .addCase(generatePairs.pending, (state) => {
        state.status = "pendingGenerate";
      })
      .addCase(generatePairs.fulfilled, (state, action) => {
        state.currentYearPairs = action.payload;
        state.status = "idle";
      })
      .addCase(generatePairs.rejected, (state) => {
        state.status = "idle";
      })
      .addCase(resetCurrentYearPairs.pending, (state) => {
        state.status = "pendingReset";
      })
      .addCase(resetCurrentYearPairs.fulfilled, (state) => {
        state.currentYearPairs = null;
        state.status = "idle";
      })
      .addCase(resetCurrentYearPairs.rejected, (state) => {
        state.status = "idle";
      });
    builder
      .addCase(fetchPairsForYear.pending, (state) => {
        state.status = "pendingFetchYearPairs";
      })
      .addCase(fetchPairsForYear.fulfilled, (state, action) => {
        const year = action.meta.arg;
        const pairs = action.payload;
        const existingIndex = state.yearPairs.findIndex(
          (yp) => yp.year === year
        );
        if (existingIndex >= 0) {
          state.yearPairs[existingIndex].pairs = pairs;
        } else {
          state.yearPairs.push({ year, pairs });
        }
        state.status = "pairsdone";
      })
      .addCase(fetchPairsForYear.rejected, (state) => {
        state.status = "idle";
      })

      .addCase(fetchAllPairs.pending, (state) => {
        state.status = "pendingFetchAllPairs";
      })
      .addCase(fetchAllPairs.fulfilled, (state, action) => {
        const pairsByYear: Record<number, Pair[]> = {};

        action.payload.forEach((pair: Pair) => {
          if (!pairsByYear[pair.year]) {
            pairsByYear[pair.year] = [];
          }
          pairsByYear[pair.year].push(pair);
        });

        state.yearPairs = Object.entries(pairsByYear).map(([year, pairs]) => ({
          year: parseInt(year),
          pairs,
        }));

        state.status = "idle";
      })
      .addCase(fetchAllPairs.rejected, (state) => {
        state.status = "idle";
      });
    builder.addCase(fetchYears.pending, (state) => {
      state.status = "pendingYears";
    });
    builder.addCase(fetchYears.rejected, (state) => {
      state.status = "rejectedYears";
    });
    builder.addCase(fetchYears.fulfilled, (state, action) => {
      state.status = "succedded";
      state.availableYears = action.payload;
    });
  },
});

export const {
  setSelectedYear,
  clearSelectedYear,
  cacheYearPairs,
  removeYearPairs,
} = giftSlice.actions;
export default giftSlice.reducer;
