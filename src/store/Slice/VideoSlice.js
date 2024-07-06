import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../../constant";


const initialState = {
    loading: false,
    uploading: false,
    uploaded: false,
    videos: {
        docs: [],
        hasNextPage: false,
    },
    video: null,
    publishToggled: false,
};
   
export const getAllvideos = createAsyncThunk("getAllVideos",
    async ({ userId, sortBy, sortType, query, page, limit }) => {
         try {
            const url = new URL(`${BASE_URL}/v1/video`);

            if(userId) url.searchParams.set("userId" , userId)
            if (query) url.searchParams.set("query", query);
            if (page) url.searchParams.set("page", page);
            if (limit) url.searchParams.set("limit", limit);

            if (sortBy && sortType) {
                url.searchParams.set("sortBy", sortBy);
                url.searchParams.set("sortType", sortType);
            }

            const response = await axiosInstance.get(url);

            return response.data.data;
         } catch (error) {

            toast.error("not getting vedio");
            throw error;
            
         }
    })

    export const publishAVideo = createAsyncThunk("publishAVideo" , async(data)=>{
        const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("videoFile", data.videoFile[0]);
            formData.append("thumbnail", data.thumbnail[0]);
        
        try {
            const response = await axiosInstance.post("/v1/video", formData);
            toast.success(response?.data?.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    })

    export const updateAVideo = createAsyncThunk("updateAVideo" , async({videoId , data})=>{
       
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("thumbnail", data.thumbnail[0]);
       
        try {
            const response = await axiosInstance.patch(
                `/v1/video/v/${videoId}`,
                formData
            );
            toast.success(response?.data?.message);
            return response.data.data;
            
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    })

    export const deleteAVideo = createAsyncThunk("deleteAVideo" , async(videoId)=>{
        try {
            const response = await axiosInstance.delete(`/v1/video/v/${videoId}`);
            toast.success(response?.data?.message);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    })

    export const getVideoById = createAsyncThunk("getVideoById" , async({videoId})=>{
        try {
            const response = await axiosInstance.get(`/v1/video/v/${videoId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }
    })

    export const togglePublishStatus = createAsyncThunk("togglePublishStatus" , async(videoId)=>{
        try {
            const response = await axiosInstance.patch(
                `/v1/video/toggle/publish/${videoId}`
            );
            toast.success(response.data.message);
            return response.data.data.isPublished;
        } catch (error) {
            toast.error(error?.response?.data?.error);
            throw error;
        }

    })

    const videoSlice = createSlice({
        name: "video",
        initialState,
        reducers: {
            updateUploadState: (state) => {
                state.uploading = false;
                state.uploaded = false;
            },
            makeVideosNull: (state) => {
                state.videos.docs = [];
            },
        },

        extraReducers: (builder) => {

            builder.addCase(getAllvideos.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(getAllvideos.fulfilled, (state, action) => {
                state.loading = false;
                state.videos.docs = [...state.videos.docs, ...action.payload];
                state.videos.hasNextPage = action.payload.hasNextPage;
            });

            builder.addCase(publishAVideo.pending, (state) => {
                state.uploading = true;
            });
            builder.addCase(publishAVideo.fulfilled, (state) => {
                state.uploading = false;
                state.uploaded = true;
            });
            builder.addCase(updateAVideo.pending, (state) => {
                state.uploading = true;
            });
            builder.addCase(updateAVideo.fulfilled, (state) => {
                state.uploading = false;
                state.uploaded = true;
            });
            builder.addCase(deleteAVideo.pending, (state) => {
                state.loading = true;
            });
            builder.addCase(deleteAVideo.fulfilled, (state) => {
                state.loading = false;
            });
            builder.addCase(getVideoById.pending, (state) => {
                state.loading = true;
            });

            builder.addCase(getVideoById.fulfilled, (state, action) => {
                state.loading = false;
                state.video = action.payload;
            });
            builder.addCase(togglePublishStatus.fulfilled, (state) => {
                state.publishToggled = !state.publishToggled;
            });
        }
    })

    export const { updateUploadState, makeVideosNull } = videoSlice.actions;

    export default videoSlice.reducer;