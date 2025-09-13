import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const settingsItems = [
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

const SettingsDropdown = () => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

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

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen((prev) => !prev)} className="p-2">
                <Icon.more_vert />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[300px] bg-[#272727] text-white rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="flex flex-col py-1">
                        {settingsItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <a
                                    href={item.href}
                                    className="flex items-center gap-4 px-4 py-2 hover:bg-[#3b3b3b] text-sm"
                                >
                                    <span className="w-5 h-5">{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>

                                {(index === 5 || index === 6) && (
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

export default SettingsDropdown;
