import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helper/axios";
import toast from "react-hot-toast";


const initialState = {
    loading: false,
    status: false,
    userData: null,
    home:false
};

export const createAccount = createAsyncThunk( "register" , async(data)=>{
         
    const formData = new FormData()  

    formData.append("avatar" , data.avatar[0]);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("fullName", data.fullName);

    if(data.coverImage[0]){
        formData.append("coverImage", data.coverImage[0]);
    }

    try {
            const response = await axiosInstance.post("/v1/users/register", formData)   
            console.log(response.data);
            toast.success("Registered successfully!!!");
            return response.data;

    } catch (error) {
        toast.error(error.response?.data?.Error)
        throw error
    }
})

export const userlogin = createAsyncThunk("login" , async(data)=>{
        
     try {
           const response = await axiosInstance.post("/v1/users/login" , data)
           return response.data.data.user
     } catch (error) {
        toast.error("login failed invalid details") 

        throw error
     }
} )



export const userlogout = createAsyncThunk("logout" , async()=>{
         
    try {
        const response = await axiosInstance.post("/v1/users/logout");
        toast.success(response.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})
export const refreshAccessToken = createAsyncThunk("refreshAccessToken" , async(data)=>{
         
    try {
           
        const response = await axiosInstance.post( "/v1/users/refresh-token",
            data)
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
            throw error;
    }
})
export const changePassword = createAsyncThunk("changePassword" , async(data)=>{
         
    try {
        
        const response = await axiosInstance.post(
            "/v1/users/change-password",
            data
        );
        toast.success(response.data?.message);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
            throw error;
    }
})
export const getCurrentUser = createAsyncThunk("getCurrentUser" , async()=>{
            
   try {
    const response = await axiosInstance.get("/v1/users/current-user");
    return response.data.data;
   } catch (error) {
    toast.error("no current user");
    throw error;
   }
   
})   

export const updateUserAvatar = createAsyncThunk("updateUserAvatar"  , async(avatar)=>{
    try {
          
        const response = await axiosInstance.patch(
            "/v1/users/update-avatar",
            avatar
        );
        toast.success("Updated details successfully!!!");
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})

export const updateCoverImg = createAsyncThunk("updateCoverImg"  , async(coverImage)=>{
    try {
        const response = await axiosInstance.patch(
            "/v1/users/update-coverImg",
            coverImage
        );
        toast.success(response.data?.message);
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})

export const updateUserDetails = createAsyncThunk("updateUserDetails"  , async(data)=>{
    try {
          
        const response = await axiosInstance.patch(
            "/v1/users/update-user",
            data
        );
        toast.success("Updated details successfully!!!");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.error);
        throw error;
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createAccount.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createAccount.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(userlogin.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(userlogin.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });
        builder.addCase(userlogout.pending , (state)=>{
             state.loading = true;
        })

        builder.addCase(userlogout.fulfilled, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });

        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });

        builder.addCase(getCurrentUser.rejected, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });

        builder.addCase(updateUserAvatar.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserAvatar.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
        });

        builder.addCase(updateUserAvatar.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(updateCoverImg.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateCoverImg.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
        });
        builder.addCase(updateCoverImg.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(updateUserDetails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.home = true;
            state.userData = action.payload.data;
        });
    }
})

export default authSlice.reducer;