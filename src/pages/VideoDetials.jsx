import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getVideoById } from "../store/Slice/VideoSlice";
import {
    CommentsList,
    TweetAndComment,
    Video,
    Description,
    Spinner,
    InfiniteScroll,
    Navbar,            
} from "../components/Index";                                 
import {             
    cleanUpComments,
    getVideoComments, 
} from "../store/Slice/commentSlice";

function VideoDetail() {
    const dispatch = useDispatch();
    const { videoId } = useParams();
    const video = useSelector((state) => state.video?.video);
    const comments = useSelector((state) => state.comment?.comments);
    const totalComments = useSelector((state) => state.comment?.totalComments);
    const hasNextPage = useSelector((state) => state.comment?.hasNextPage);
    const loading = useSelector((state) => state.comment?.loading);
    const [page, setPage] = useState(1);

    // const channel = useSelector((state) => state.user?.profileData);
    
    useEffect(() => {
        if (videoId) {
            dispatch(getVideoById({ videoId }));
            dispatch(getVideoComments({ videoId }));
        }

        return () => dispatch(cleanUpComments());
    }, [dispatch, videoId]);

    const fetchMoreComments = useCallback(() => {
        if (!loading && hasNextPage) {
            dispatch(getVideoComments({ videoId, page: page + 1 }));
            setPage((prev) => prev + 1);
        }
    }, [page, loading, hasNextPage, dispatch, videoId]);
    
    return (
        <>
       {console.log(comments)}
            <Navbar />
            <Video
                src={video?.videoFile?.url}
                poster={video?.thumbnail?.url}
            />
            <Description
                avatar={video?.owner?.avatar}
                channelName={video?.owner?.username}
                createdAt={video?.createdAt}
                description={video?.description}
                isSubscribed={video?.owner?.isSubscribed}
                likesCount={video?.likesCount}
                subscribersCount={video?.owner?.subscribersCount}
                title={video?.title}
                views={video?.views}
                key={video?._id}
                isLiked={video?.isLiked}
                videoId={video?._id}
                channelId={video?.owner?._id}
            />
            <div className="text-white font-semibold sm:px-5 px-3">
                {totalComments} Comments
            </div>
            <TweetAndComment
                comment={true}
                videoId={video?._id}
            />
            <InfiniteScroll
                fetchMore={fetchMoreComments}
                hasNextPage={hasNextPage}
            >
                <div className="w-full sm:max-w-4xl">
                    {comments?.map((comment) => (
                        <CommentsList
                            key={comment?._id}
                            avatar={comment?.ownerdetails?.avatar}
                            commentId={comment?._id}
                            content={comment?.content}
                            createdAt={comment?.createdAt}
                            fullName={comment?.ownerdetails?.fullName}
                            isLiked={comment?.isLiked}
                            likesCount={comment?.likesCount}
                            username={comment?.ownerdetails?.username}
                        />
                    ))}
                    {loading && (
                        <div className="w-full flex justify-center items-center">
                            <Spinner width={10} />
                        </div>
                    )}
                </div>
            </InfiniteScroll>
        </>
    );
}

export default VideoDetail;