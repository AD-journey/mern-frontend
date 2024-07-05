import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slice/authslice.js";

import userSliceReducer from "./Slice/userSlice.js";
import videoSliceReducer from "./Slice/VideoSlice.js";
import subscriptionSlice from "./Slice/SubscriptionSlice.js";
import likeSlice from "./Slice/likeSlice.js";
import tweetSlice from "./Slice/tweetSlice.js";
import commentSlice from "./Slice/commentSlice.js";
import dashboardSlice from "./Slice/dashboardSlice.js";
import playlistSlice from "./Slice/playlistSlice.js";


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        user: userSliceReducer,
        video: videoSliceReducer,
        subscription: subscriptionSlice,
        like: likeSlice,
        tweet: tweetSlice,
        comment: commentSlice,
        dashboard: dashboardSlice,
        playlist: playlistSlice
    }
});

export default store;