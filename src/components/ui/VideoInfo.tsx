"use client";

import React from "react";
import Icon from "./Icon";
import { timeAgo } from "@/utils/timeAgo";

interface VideoInfoProps {
    createdAt: string;
    title: string;
    author: string;
    views: number;
    likes: number;
    likedByUser: boolean;
    onLikeToggle: () => void;
    description?: string;
    picture: string;
}

const VideoInfo = ({
    createdAt,
    title,
    author,
    views,
    likes,
    likedByUser,
    onLikeToggle,
    description,
    picture,
}: VideoInfoProps) => {
    return (
        <>
            <h1 className="text-xl font-semibold mb-2">{title}</h1>

            <div className="flex justify-between items-center text-sm mb-4">
                <div className="flex gap-2 items-end">
                    <button className="w-8 h-8 mt-1 rounded-full overflow-hidden">
                        <img
                            src={picture}
                            alt="profile"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </button>
                    <span className="font-medium">{author}</span>
                    <div className="flex text-gray-400">
                        {timeAgo(createdAt)}
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-2 bg-[#3d3d3c] px-4 py-2 rounded-full items-center">
                        {views} views
                    </div>

                    <button
                        onClick={onLikeToggle}
                        className="flex gap-2 bg-[#3d3d3c] px-4 py-2 rounded-full items-center"
                    >
                        <div className={likedByUser ? "text-amber-500" : ""}>
                            <Icon.liked_videos_icon />
                        </div>
                        {likes}
                    </button>

                    <button className="flex gap-2 items-center bg-[#3d3d3c] px-4 py-2 rounded-full">
                        <Icon.share_icon /> Share
                    </button>
                </div>
            </div>

            {description && (
                <div>
                    <div className="text-gray-400 mb-1">Description</div>
                    <div className="bg-[#2a2929] p-3 rounded whitespace-pre-line">
                        {description}
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoInfo;
