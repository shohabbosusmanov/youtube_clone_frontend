"use client";

import dynamic from "next/dynamic";
import "plyr-react/plyr.css";
import React, { useMemo } from "react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

export interface PlyrVideoComponentProps {
    src: string;
    poster?: string;
    options?: any;
    className?: string;
}

const PlyrVideoComponent = React.memo(function PlyrVideoComponent({
    src,
    poster,
    options = {},
    className = "",
}: PlyrVideoComponentProps) {
    const source = useMemo(
        () => ({
            type: "video" as const,
            sources: [
                {
                    src,
                    type: "video/mp4",
                },
            ],
            poster,
        }),
        [src, poster]
    );

    const memoizedOptions = useMemo(() => options, [options]);

    return (
        <div className={`w-auto h-full flex flex-col ${className}`}>
            <div className="rounded-lg mb-4">
                <Plyr source={source} options={memoizedOptions} />
            </div>
        </div>
    );
});

export default PlyrVideoComponent;
