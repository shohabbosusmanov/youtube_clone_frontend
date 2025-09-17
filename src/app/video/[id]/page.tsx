"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "@/app/page";
import { useAuthStore } from "@/store/authStore";
import CommentsSection from "@/components/ui/CommentSection";

import VideoInfo from "@/components/ui/VideoInfo";
import VideoPlayer from "@/components/ui/VideoPlayer";

export default function VideoPage() {
    const user = useAuthStore((s) => s.user);
    const { id } = useParams() as { id: string };
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [likesCount, setLikesCount] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`${BaseUrl}/video/${id}`);
                setVideo(res.data);
            } catch {
                setError("Failed to load video");
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!id || !user) return;
            try {
                const res = await axios.get(
                    `${BaseUrl}/likes/${id}/likes-status`,
                    {
                        withCredentials: true,
                    }
                );
                setLikesCount(res.data.likesCount);
                setLikedByUser(res.data.likedByCurrentUser);
            } catch (err) {
                console.error("Error loading like status", err);
            }
        };
        fetchLikeStatus();
    }, [id, user]);

    const toggleLike = async () => {
        if (!user || !video) return;
        try {
            if (likedByUser) {
                await axios.post(
                    `${BaseUrl}/likes/unlike`,
                    { videoId: video.id },
                    { withCredentials: true }
                );
                setLikedByUser(false);
                setLikesCount((prev) => prev - 1);
            } else {
                await axios.post(
                    `${BaseUrl}/likes/like`,
                    { videoId: video.id },
                    { withCredentials: true }
                );
                setLikedByUser(true);
                setLikesCount((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Failed to like/unlike", err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!video) return <div>Video not found</div>;

    return (
        <div className="p-4 w-[85%] mx-auto">
            <VideoPlayer
                src={`${BaseUrl}/video/watch/${video.videoUrl}?quality=360p`}
                poster={video.thumbnail}
            />

            <VideoInfo
                createdAt={video.createdAt}
                title={video.title}
                author={video.author.username}
                views={video.viewsCount}
                likes={likesCount}
                likedByUser={likedByUser}
                onLikeToggle={toggleLike}
                description={video.description || ""}
                picture={video.author.picture}
            />

            <CommentsSection videoId={video.id} />
        </div>
    );
}
