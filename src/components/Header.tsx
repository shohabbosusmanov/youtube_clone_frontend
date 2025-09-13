"use client";

import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";
import axios from "axios";
import { useEffect } from "react";
import Dropdown from "./ui/Dropdown";
import Icon from "./ui/Icon";
import NotificationsDropdown from "./ui/NotificationModal";
import ProfileDropdown from "./ui/ProfileDropdown";
import Link from "next/link";
import SettingsDropdown from "./ui/SettingsDropdown";

const Header = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);
    const toggle = useSidebarStore((s) => s.toggle);

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/auth/me",
                    {
                        withCredentials: true,
                    }
                );
                if (data.user) {
                    setUser(data.user);
                }
            } catch {
                setUser(null);
            }
        }
        fetchUser();
    }, [setUser]);

    const login = () => {
        window.location.href =
            "http://localhost:4000/auth/google?prompt=select_account";
    };

    return (
        <div className="px-4 h-14 flex items-center justify-between">
            <div className="left flex h-full w-fit items-center">
                <button
                    onClick={toggle}
                    className="w-10 h-10 flex justify-center items-center rounded-full fill-current hover:bg-[#3b3b3b]"
                >
                    <Icon.bars />
                </button>
                <Link
                    href={"/"}
                    className="logo h-full w-[126px] flex justify-center items-center fill-current"
                >
                    <Icon.logo />
                </Link>
            </div>
            <div className="center h-10 max-w-[732px] flex ml-10 px-1 grow">
                <div className="flex grow">
                    <form
                        action=""
                        className="group h-full ml-8 pl-4 pr-1 border border-[#575757] grow flex rounded-l-3xl focus-within:ml-0 focus-within:pl-0 focus-within:border-[#025eb9]"
                    >
                        <span className="hidden w-12 px-[14px] group-focus-within:flex items-center justify-center ">
                            <Icon.search />
                        </span>
                        <input
                            type="text"
                            placeholder="Search"
                            className=" outline-none grow"
                        />
                    </form>
                    <button className="h-full w-16 border border-l-0 border-[#575757] bg-[#222222] flex items-center justify-center rounded-r-3xl">
                        <Icon.search />
                    </button>
                </div>
                <button className="w-10 h-full ml-3 rounded-full flex items-center justify-center bg-[#272727] hover:bg-[#3b3b3b]">
                    <Icon.microphone />
                </button>
            </div>
            <div className="left flex items-center gap-2">
                {user ? (
                    <>
                        <Dropdown />

                        <NotificationsDropdown />

                        <ProfileDropdown />
                    </>
                ) : (
                    <>
                        {/* <button className="p-2">
                            <Icon.more_vert />
                        </button> */}
                        <SettingsDropdown />
                        <button
                            onClick={login}
                            className="w-[96px] h-9 border border-[#575757] text-white rounded-full px-2 text-sm font-[500] flex items-center gap-2 hover:border-[#222222] hover:bg-[#222222]"
                        >
                            <Icon.user_icon /> Sign in
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
