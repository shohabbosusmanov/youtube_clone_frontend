import { useModalStore } from "@/store/notificationModalStore";
import React, { useEffect, useRef } from "react";
import Icon from "./Icon";

const NotificationsDropdown = () => {
    const isOpen = useModalStore((s) => s.isOpen);
    const toggle = useModalStore((s) => s.setIsOpen);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                toggle();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, toggle]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={toggle}
                className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-[#3b3b3b]"
            >
                <Icon.notification />
            </button>

            {isOpen && (
                <div className="absolute right-0 w-120 h-[642px] bg-[#272727] text-white rounded-xl z-50">
                    <div className="flex justify-between items-center pl-4 pr-2 py-1">
                        <p className="text-base">Notifications</p>
                        <button className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-[#3b3b3b] z-1">
                            <Icon.settings_icon />
                        </button>
                    </div>
                    <hr className="border-[#535353]" />
                    <div className="absolute inset-0 flex justify-center items-center text-[#717171] z-0 mb-25">
                        <Icon.notification_bg_icon />
                    </div>
                    <div className="absolute top-85 mx-[100px] text-center text-[#aaaaaa]">
                        <p className="font-[500] mb-3">
                            Your notifications live here
                        </p>
                        <p className="text-sm">
                            Subscribe to your favorite channels to get notified
                            about their latest videos.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
