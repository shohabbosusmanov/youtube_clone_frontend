"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { BaseUrl } from "../page";

type Video = {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string;
    duration: number;
    viewsCount: number;
    likesCount: number;
    createdAt: string;
    _count: {
        comments: number;
        likes: number;
        views: number;
    };
};

const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function LikedVideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();

    useEffect(() => {
        async function fetchLikedVideos() {
            if (!user) return;
            try {
                const response = await axios.get(
                    `${BaseUrl}/users/liked-videos`,
                    {
                        withCredentials: true,
                    }
                );
                setVideos(response.data || []);
            } catch (err) {
                console.error("Failed to fetch liked videos", err);
            } finally {
                setLoading(false);
            }
        }

        fetchLikedVideos();
    }, [user]);

    const handleUnlike = async (videoId: string) => {
        try {
            await axios.post(
                `${BaseUrl}/likes/unlike`,
                { videoId },
                { withCredentials: true }
            );
            setVideos((prev) => prev.filter((v) => v.id !== videoId));
        } catch (err) {
            console.error("Failed to unlike", err);
            alert("Failed to unlike video.");
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 bg-[#0f0f0f] min-h-screen text-white">
                Please log in to view liked videos.
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-[#0f0f0f] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Liked Videos
                </h1>

                {videos.length === 0 ? (
                    <div className="text-center py-12 text-white">
                        No liked videos yet.
                    </div>
                ) : (
                    <div className="rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-[#0f0f0f] text-sm font-medium border-b border-gray-600">
                            <div className="col-span-4">Video</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2 text-center">Views</div>
                            <div className="col-span-2 text-center">Likes</div>
                            <div className="col-span-2 text-center">
                                Actions
                            </div>
                        </div>

                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="grid grid-cols-12 gap-4 p-4 hover:bg-[#272727] border-b border-gray-800 last:border-b-0 cursor-pointer transition-colors"
                                onClick={() =>
                                    router.push(`/video/${video.id}`)
                                }
                            >
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={
                                                video.thumbnail ||
                                                "/api/placeholder/120/90"
                                            }
                                            alt={video.title}
                                            className="w-20 h-12 object-cover rounded bg-[#0f0f0f]"
                                        />
                                        <div className="absolute bottom-1 right-1 bg-[#0f0f0f] text-xs px-1 rounded">
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-medium truncate">
                                            {video.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm truncate">
                                            {video.description ||
                                                "No description"}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center text-white">
                                    {formatDate(video.createdAt)}
                                </div>

                                <div className="col-span-2 flex items-center justify-center text-white">
                                    {video.viewsCount.toLocaleString()}
                                </div>

                                <div className="col-span-2 flex items-center justify-center text-white">
                                    {video.likesCount.toLocaleString()}
                                </div>

                                <div className="col-span-2 flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUnlike(video.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        <Icon.close_icon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
