import { Video } from "@/app/page";
import { formatDuration } from "@/utils/formatDuration";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import React from "react";

export const VideoCard: React.FC<Video> = ({
    thumbnail,
    title,
    author,
    createdAt,
    _count,
    duration,
    id,
}) => {
    return (
        <div className="bg-transparent cursor-pointer group">
            <Link href={`/video/${id}`}>
                <div className="relative mb-3">
                    <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            {formatDuration(+duration)}
                        </div>
                    </div>
                </div>
            </Link>

            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <img
                        src={author.picture}
                        alt={author.username}
                        className="w-9 h-9 rounded-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <Link href={`/video/${id}`}>
                        <h3 className="text-white text-base font-[600] leading-5 mb-1 line-clamp-2 group-hover:text-gray-200 transition-colors">
                            {title}
                        </h3>
                    </Link>

                    <p className="text-gray-400 text-sm mb-1 fonn-[500] hover:text-white transition-colors cursor-pointer">
                        {author.username}
                    </p>

                    <div className="flex items-center text-gray-400 text-sm">
                        <span>{_count.views} views</span>
                        <span className="mx-1">•</span>
                        <span>{timeAgo(createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
