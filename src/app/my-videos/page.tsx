"use client";
import React from "react";
import axios from "axios";

type Video = {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string | null;
    status: "processing" | "done" | "error";
    duration?: number | null;
    createdAt: string;
    publishedAt?: string | null;
    viewsCount: number;
    likesCount: number;
    _count?: {
        comments: number;
        likes: number;
    };
};

export default function MyVideosPage() {
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await axios.get("/my-videos");
                setVideos(res.data);
            } catch (err) {
                setError("Failed to load videos.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, []);

    if (loading) return <div className="p-6 text-white">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    if (videos.length === 0)
        return (
            <div className="p-6 text-center text-white">
                No videos uploaded yet.
            </div>
        );

    return (
        <div className="p-6 bg-[#0f0f0f] min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">My videos</h1>
            <div>
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="p-4 mb-2 bg-gray-800 rounded cursor-pointer"
                        onClick={() =>
                            (window.location.href = `/video/${video.id}`)
                        }
                    >
                        <h3 className="text-white">{video.title}</h3>
                        <p className="text-gray-400">{video.description}</p>
                        <p className="text-gray-400 text-sm">
                            Status:{" "}
                            {video.status === "done"
                                ? "Published"
                                : video.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
