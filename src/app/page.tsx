"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { VideoCard } from "@/components/ui/VideoCard";
import { User } from "@/store/authStore";
import { useSearchStore } from "@/store/searchStore";

export type Video = {
    thumbnail: string;
    author: Partial<User>;
    title: string;
    views: string;
    videoUrl: string;
    createdAt: string;
    duration: string;
    _count: any;
    id: string;
};
export const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchTerm = useSearchStore((state) => state.query);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = searchTerm
                    ? `${BaseUrl}/video?search=${encodeURIComponent(
                          searchTerm
                      )}`
                    : `${BaseUrl}/video`;

                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch videos");
                const data = await res.json();
                setVideos(data);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [searchTerm]);

    return (
        <div className="h-screen flex flex-col font-sans">
            <div className="sticky top-0 z-50 bg-[#0f0f0f] shadow">
                <Header />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className=" h-full sticky top-0 bg-[#0f0f0f] overflow-auto shadow">
                    <Sidebar />
                </div>

                <div className="flex-1 h-full overflow-y-auto p-4">
                    <h2 className="text-xl font-semibold mb-4">All videos</h2>

                    {loading && <p>Loading videos...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {videos.map((video) => (
                            <VideoCard key={video.id} {...video} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
