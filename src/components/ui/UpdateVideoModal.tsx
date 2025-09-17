"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BaseUrl } from "@/app/page";
import { useEditVideoModalStore } from "@/store/updateVideoModalStore";
import Icon from "./Icon";

const EditVideoModal = ({ onUpdate }: { onUpdate?: () => void }) => {
    const { isOpen, videoId, initialTitle, initialDescription, closeModal } =
        useEditVideoModalStore();

    const ref = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setDescription(initialDescription);
        }
    }, [isOpen, initialTitle, initialDescription]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                closeModal();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, closeModal]);

    const handleSubmit = async () => {
        if (!videoId) return;

        try {
            await axios.post(
                `${BaseUrl}/video/${videoId}/update`,
                { title, description },
                { withCredentials: true }
            );
            closeModal();
            onUpdate?.();
        } catch (error) {
            console.error("Failed to update video:", error);
            alert("Update failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={ref}
                className="bg-[#272727] w-[500px] rounded-xl p-6 text-white relative"
            >
                <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 rounded bg-[#0f0f0f] text-white border border-gray-600 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded bg-[#0f0f0f] text-white border border-gray-600 focus:outline-none"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={closeModal}
                        className="text-sm px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                        Save
                    </button>
                </div>

                <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <Icon.close_icon />
                </button>
            </div>
        </div>
    );
};

export default EditVideoModal;
