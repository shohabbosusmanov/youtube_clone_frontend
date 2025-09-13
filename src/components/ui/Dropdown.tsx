// const items = [
//     {
//         key: "upload",
//         label: "Upload video",
//         href: "/upload",
//         icon: <Icon.upload_video_icon />,
//     },
//     {
//         key: "live",
//         label: "Go live",
//         href: "/live",
//         icon: <Icon.go_live_icon />,
//     },
//     {
//         key: "post",
//         label: "Create post",
//         href: "/post",
//         icon: <Icon.create_post_icon />,
//     },
// ];

// import React, { useState, useRef, useEffect } from "react";
// import Icon from "./Icon";

// const Dropdown: React.FC = () => {
//     const [open, setOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     const toggleDropdown = () => setOpen((prev) => !prev);

//     const handleClickOutside = (e: MouseEvent) => {
//         if (
//             dropdownRef.current &&
//             e.target instanceof Node &&
//             !dropdownRef.current.contains(e.target)
//         ) {
//             setOpen(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener("mousedown", handleClickOutside);
//         return () =>
//             document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <div className="relative inline-block text-left" ref={dropdownRef}>
//             <button
//                 onClick={toggleDropdown}
//                 className="pl-2 pr-3 font-[500] py-[6px] rounded-full flex items-center gap-1 bg-[#272727] hover:bg-[#3b3b3b] text-white"
//             >
//                 <Icon.plus /> Create
//             </button>

//             {open && (
//                 <div className="absolute left-0 mt-2 w-42 rounded-md shadow-lg bg-[#272727] z-50">
//                     <div className="py-1">
//                         {items.map((item) => (
//                             <a
//                                 key={item.key}
//                                 href={item.href}
//                                 className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#3b3b3b]"
//                             >
//                                 <span>{item.icon}</span>
//                                 <span>{item.label}</span>
//                             </a>
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dropdown;

import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import UploadModal from "./UploadVideoModal";

const items = [
    {
        key: "upload",
        label: "Upload video",
        href: "/upload",
        icon: <Icon.upload_video_icon />,
    },
    {
        key: "live",
        label: "Go live",
        href: "/live",
        icon: <Icon.go_live_icon />,
    },
    {
        key: "post",
        label: "Create post",
        href: "/post",
        icon: <Icon.create_post_icon />,
    },
];

const Dropdown: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setOpen((prev) => !prev);

    const handleClickOutside = (e: MouseEvent) => {
        if (
            dropdownRef.current &&
            e.target instanceof Node &&
            !dropdownRef.current.contains(e.target)
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleItemClick = (key: string, href: string) => {
        setOpen(false);

        if (key === "upload") {
            setUploadModalOpen(true);
        } else {
            window.location.href = href;
        }
    };

    return (
        <>
            <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="pl-2 pr-3 font-[500] py-[6px] rounded-full flex items-center gap-1 bg-[#272727] hover:bg-[#3b3b3b] text-white"
                >
                    <Icon.plus /> Create
                </button>

                {open && (
                    <div className="absolute left-0 mt-2 w-42 rounded-md shadow-lg bg-[#272727] z-50">
                        <div className="py-1">
                            {items.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() =>
                                        handleItemClick(item.key, item.href)
                                    }
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#3b3b3b] text-white"
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isUploadModalOpen && (
                <UploadModal onClose={() => setUploadModalOpen(false)} />
            )}
        </>
    );
};

export default Dropdown;
