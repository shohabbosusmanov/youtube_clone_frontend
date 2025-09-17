import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { BaseUrl } from "@/app/page";

const profileItems = [
    { label: "Google account", icon: <Icon.google_icon />, href: "#" },
    { label: "Switch account", icon: <Icon.switch_account_icon />, href: "#" },
    { label: "Sign out", icon: <Icon.sign_out_icon />, action: "signout" },
    { label: "YouTube Studio", icon: <Icon.youtube_studio_icon />, href: "#" },
    {
        label: "Purchases and memberships",
        icon: <Icon.purchased_icon />,
        href: "#",
    },
    {
        label: "Your data in YouTube",
        icon: <Icon.your_data_icon />,
        href: "#",
    },
    {
        label: "Appearance: Device theme",
        icon: <Icon.theme_icon />,
        href: "#",
    },
    {
        label: "Language: English",
        icon: <Icon.language_icon />,
        href: "#",
    },
    {
        label: "Restricted mode: Off",
        icon: <Icon.restricted_mode_icon />,
        href: "#",
    },
    {
        label: "Location: United States",
        icon: <Icon.location_icon />,
        href: "#",
    },
    {
        label: "Keyboard shortcuts",
        icon: <Icon.keyboard_icon />,
        href: "#",
    },
    {
        label: "Settings",
        icon: <Icon.settings_icon />,
        href: "#",
    },
    {
        label: "Help",
        icon: <Icon.help_icon />,
        href: "#",
    },
    {
        label: "Send feedback",
        icon: <Icon.send_feedback_icon />,
        href: "#",
    },
];

const ProfileDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);

    const handleLogout = async () => {
        try {
            await axios.post(`${BaseUrl}/auth/signout`, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
        }
    };

    const handleItemClick = (item: any) => {
        if (item.action === "signout") {
            handleLogout();
        } else if (item.href) {
            window.location.href = item.href;
        }
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-8 h-8 mt-1 rounded-full overflow-hidden"
            >
                <img
                    src={user.picture}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[300px] bg-[#272727] text-white rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#444]">
                        <div className="flex items-center gap-4">
                            <img
                                src={user.picture}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="text-sm">
                                <p className="font-semibold">
                                    {user.username.split(" ")[0]}
                                </p>
                                <p className="text-[#aaa]">{user.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col py-1">
                        {profileItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                {item.action ? (
                                    <button
                                        onClick={() => handleItemClick(item)}
                                        className="flex items-center gap-4 px-4 py-2 hover:bg-[#3b3b3b] text-sm text-left w-full"
                                    >
                                        <span className="w-5 h-5">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </button>
                                ) : (
                                    <a
                                        href={item.href}
                                        className="flex items-center gap-4 px-4 py-2 hover:bg-[#3b3b3b] text-sm"
                                    >
                                        <span className="w-5 h-5">
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </a>
                                )}

                                {(index === 2 ||
                                    index === 4 ||
                                    index === 10 ||
                                    index === 11) && (
                                    <hr className="my-2 text-[#444]" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
