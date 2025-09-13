"use client";
import React from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import Link from "next/link";
import Icon from "./ui/Icon";

const allItems = [
    { label: "Home", icon: <Icon.home_icon />, href: "/" },
    { label: "Shorts", icon: <Icon.shorts_icon />, href: "/shorts" },
    {
        label: "Subscriptions",
        icon: <Icon.subscriptions />,
        href: "/subscriptions",
    },
    { label: "You", icon: <Icon.user_icon />, href: "/you" },
    { label: "Downloads", icon: <Icon.downloads_icon />, href: "/downloads" },
    {
        label: "History",
        icon: <Icon.history_icon />,
        href: "/history",
    },
    {
        label: "Playlists",
        icon: <Icon.playlists_icon />,
        href: "/playlists",
    },
    {
        label: "You videos",
        icon: <Icon.you_videos_icon />,
        href: "/my-videos",
    },
    {
        label: "Watch later",
        icon: <Icon.watch_later_icon />,
        href: "/watch-later",
    },
    { label: "Liked videos", icon: <Icon.downloads_icon />, href: "/liked" },
];

const Sidebar = () => {
    const collapsed = useSidebarStore((s) => s.collapsed);

    return (
        <aside
            className={`h-[calc(100vh-56px)] bg-[#0f0f0f] text-white px-1 ${
                collapsed ? "w-[72px]" : "w-[240px]"
            }`}
        >
            {collapsed ? (
                <div className="w-full flex flex-col items-center text-[10px]">
                    {allItems.slice(0, 5).map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center py-[15px] rounded-[10px] hover:bg-[#3f3f3f] w-full"
                        >
                            <div className="w-6 h-6 mb-1">{item.icon}</div>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <nav className="flex flex-col px-3 py-[7px] text-sm">
                    {allItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="w-full flex items-center gap-6 px-2 py-2 rounded-[10px] hover:bg-[#3f3f3f] text-sm"
                        >
                            <div className="w-6 h-6">{item.icon}</div>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            )}
        </aside>
    );
};

export default Sidebar;
