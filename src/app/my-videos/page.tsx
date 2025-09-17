"use client";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BaseUrl } from "../page";
import Icon from "@/components/ui/Icon";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEditVideoModalStore } from "@/store/updateVideoModalStore";
import EditVideoModal from "@/components/ui/UpdateVideoModal";

type Video = {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string;
    status: "processing" | "done" | "error";
    videoUrl: string;
    duration: number;
    viewsCount: number;
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    authorId: string;
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

export default function MyVideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"date" | "views" | "likes">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const user = useAuthStore((s) => s.user);

    const openEditModal = useEditVideoModalStore((s) => s.openModal);

    const router = useRouter();

    useEffect(() => {
        async function fetchVideos() {
            if (!user) {
                setVideos([]);
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${BaseUrl}/video/my-videos`, {
                    withCredentials: true,
                });
                setVideos(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Failed to fetch videos", err);
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, [user]);

    const handleSort = (field: "date" | "views" | "likes") => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const sortedVideos = useMemo(() => {
        return [...videos].sort((a, b) => {
            let aValue: number | string;
            let bValue: number | string;

            switch (sortBy) {
                case "date":
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case "views":
                    aValue = a.viewsCount;
                    bValue = b.viewsCount;
                    break;
                case "likes":
                    aValue = a.likesCount;
                    bValue = b.likesCount;
                    break;
                default:
                    return 0;
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    }, [videos, sortBy, sortOrder]);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this video?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`${BaseUrl}/video/${id}`, {
                withCredentials: true,
            });

            setVideos((prev) => prev.filter((video) => video.id !== id));
        } catch (error) {
            console.error("Failed to delete video:", error);
            alert("Error deleting video.");
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-[#0f0f0f] min-h-screen">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 bg-[#0f0f0f] min-h-screen">
                <div className="text-white">
                    Please log in to view your videos.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-[#0f0f0f] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">
                    My videos
                </h1>

                {videos.length === 0 ? (
                    <div className="text-center py-12 text-white">
                        No videos uploaded yet.
                    </div>
                ) : (
                    <div className="bg-[#0f0f0f] rounded-lg overflow-hidden">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-[#0f0f0f] text-sm font-medium border-b border-gray-600">
                            <div className="col-span-4">Video</div>
                            <div className="col-span-1 text-center">
                                Visibility
                            </div>
                            <div className="col-span-1 text-center">
                                Restrictions
                            </div>
                            <div className="col-span-2">
                                <button
                                    onClick={() => handleSort("date")}
                                    className="flex items-center gap-1 hover:text-white transition-colors"
                                >
                                    Date
                                    <span className="text-xs">
                                        {sortBy === "date" &&
                                            (sortOrder === "desc" ? "↓" : "↑")}
                                    </span>
                                </button>
                            </div>
                            <div className="col-span-1 text-center">
                                <button
                                    onClick={() => handleSort("views")}
                                    className="hover:text-white transition-colors"
                                >
                                    Views
                                    {sortBy === "views" && (
                                        <span className="ml-1 text-xs">
                                            {sortOrder === "desc" ? "↓" : "↑"}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="col-span-1 text-center">
                                Comments
                            </div>
                            <div className="col-span-1 text-center">
                                <button
                                    onClick={() => handleSort("likes")}
                                    className="hover:text-white transition-colors"
                                >
                                    Likes
                                    {sortBy === "likes" && (
                                        <span className="ml-1 text-xs">
                                            {sortOrder === "desc" ? "↓" : "↑"}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="col-span-1 text-center">
                                Actions
                            </div>
                        </div>

                        {sortedVideos.map((video) => (
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
                                                "Add description"}
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="flex items-center gap-1">
                                        <Icon.public_icon />
                                        <span className="text-sm">Public</span>
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center text-sm">
                                    None
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <div className="text-white text-sm">
                                        {formatDate(video.createdAt)}
                                    </div>
                                    <div className="text-xs">
                                        {video.status === "done"
                                            ? "Published"
                                            : video.status}
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center text-white">
                                    {video.viewsCount.toLocaleString()}
                                </div>

                                <div className="col-span-1 flex items-center justify-center text-white">
                                    {video._count?.comments || 0}
                                </div>

                                <div className="col-span-1 flex items-center justify-center text-white">
                                    {video.likesCount > 0
                                        ? video.likesCount.toLocaleString()
                                        : 0}
                                </div>

                                <div className="col-span-1 flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(
                                                video.id,
                                                video.title,
                                                video.description || ""
                                            );
                                        }}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(video.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <EditVideoModal
                    onUpdate={() => {
                        window.location.reload();
                    }}
                />
            </div>
        </div>
    );
}
