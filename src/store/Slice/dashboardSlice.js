import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axios";
import toast from "react-hot-toast";

const initialState = {
    loading: false,
    channelStats: null,
    channelVideos: []
};

export const getChannelStats = createAsyncThunk(
    "getChannelStats",
    async () => {
        try {
            const response = await axiosInstance.get('/v1/dashboard/stats');
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const getChannelVideos = createAsyncThunk("getChannelVideos" , async()=>{
      
    try {
           const response = await axiosInstance.get("/v1/dashboard/videos")

           return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})

const dashboardSlice = createSlice({
    name:"dashboard",
    initialState,
    reducers:{},

    extraReducers:(builder)=>{
           
          builder.addCase(getChannelStats.pending , (state)=>{
                state.loading= true;
          })

          builder.addCase(getChannelStats.fulfilled, (state, action) => {
            state.loading = false;
            state.channelStats = action.payload;
        });
        builder.addCase(getChannelVideos.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getChannelVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.channelVideos = action.payload;
        });
    }
})

export default dashboardSlice.reducer;