import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constant";


const initialState = {
    loading: false,
    comments:[],
    totalComments: null,
    hasNextPage: false,
};

export const createAComment = createAsyncThunk(
    "createAComment",
    async ({ videoId, content }) => {
        try {
            console.log({ videoId, content });
            const response = await axiosInstance.post(`/v1/comment/${videoId}`, {
                content,
            });
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);export const editAComment = createAsyncThunk(
    "editAComment",
    async ({ commentId, content }) => {
        try {
            const response = await axiosInstance.patch(
                `/v1/comment/c/${commentId}`,
                { content }
            );
            toast.success(response.data?.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const deleteAComment = createAsyncThunk(
    "deleteAComment",
    async (commentId) => {
        try {
            const response = await axiosInstance.delete(
                `/v1/comment/c/${commentId}`
            );
            toast.success(response.data.message);
            console.log(response.data.data);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    }
);

export const getVideoComments = createAsyncThunk(
    "getVideoComments",
    async ({ videoId, page, limit }) => {
        try {
        const url = new URL(`${BASE_URL}/v1/comment/${videoId}`);
        if (page) url.searchParams.set("page", page);
        if (limit) url.searchParams.set("limit", limit);

      
            const response = await axiosInstance.get(url);
           
            return response.data.data;
           
        } catch (error) {
            toast.error("not getting comments");
            throw error;
        }
    }
);

const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        cleanUpComments: (state) => {
            state.comments = [];
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getVideoComments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getVideoComments.fulfilled, (state, action) => {
            state.loading = false;
            state.comments = [...state.comments, ...action.payload.docs];
            state.totalComments = action.payload.totalDocs;
            state.hasNextPage = action.payload.hasNextPage;
        });
        builder.addCase(createAComment.fulfilled, (state, action) => {
            state.comments.unshift(action.payload);
            state.totalComments++;
        });
        builder.addCase(deleteAComment.fulfilled, (state, action) => {
            state.comments = state.comments.filter(
                (comment) => comment._id !== action.payload.commentId
            );
            state.totalComments--;
        });
    },
})

export const { cleanUpComments } = commentSlice.actions;

export default commentSlice.reducer;