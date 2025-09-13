"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type UploadModalProps = {
    onClose: () => void;
};

export default function UploadModal({ onClose }: UploadModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [status, setStatus] = useState<string>("");
    const [videoId, setVideoId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelect = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
    };

    const pollStatus = async (id: string) => {
        const interval = setInterval(async () => {
            try {
                const resp = await axios.get(
                    `http://localhost:4000/video/status/${id}`,
                    {
                        withCredentials: true,
                    }
                );
                const st = resp.data.status;
                setStatus(st);
                if (st === "done") {
                    clearInterval(interval);
                    router.push("/my-videos");
                }
                if (st === "error") {
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("Status poll error", err);
                clearInterval(interval);
                setStatus("error");
            }
        }, 3000);
    };

    const handleSubmit = async () => {
        if (!file || !title) return;

        setLoading(true);
        setUploadProgress(0);
        setStatus("uploading");

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("file", file);

            const resp = await axios.post(
                "http://localhost:4000/video/upload",
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        if (e.total) {
                            const perc = Math.round((e.loaded * 100) / e.total);
                            setUploadProgress(perc);
                        }
                    },
                }
            );

            const id = resp.data.videoId;
            setVideoId(id);
            setStatus(resp.data.status);

            pollStatus(id);
        } catch (err) {
            console.error("Upload error", err);
            setStatus("error");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-[#1f1f1f] text-white p-6 rounded-xl w-[500px]">
                <h2 className="text-xl font-bold mb-4">Upload Video</h2>

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mb-3 bg-[#333] rounded"
                    disabled={loading}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mb-3 bg-[#333] rounded"
                    disabled={loading}
                />

                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleSelect}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            📁 Select Video
                        </button>
                        <input
                            type="file"
                            ref={inputRef}
                            accept="video/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            disabled={loading}
                        />
                    </div>
                    {file && <p className="text-sm">{file.name}</p>}
                </div>

                {status && (
                    <div className="w-full mt-2">
                        <p className="text-sm">
                            Status: {status}{" "}
                            {status === "uploading" && `(${uploadProgress}%)`}
                        </p>
                        {status === "uploading" && (
                            <div className="w-full mt-1">
                                <div className="bg-gray-700 h-2 rounded overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-2"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !file || !title}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}
