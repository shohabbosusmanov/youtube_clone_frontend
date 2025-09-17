import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "@/app/page";
import { timeAgo } from "@/utils/timeAgo";
import { useAuthStore } from "@/store/authStore";

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        picture: string;
    };
}

interface CommentsSectionProps {
    videoId: string;
}

export default function CommentsSection({ videoId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((s) => s.user);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
        null
    );
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        async function fetchComments() {
            try {
                const res = await axios.get(`${BaseUrl}/comments/${videoId}`, {
                    withCredentials: true,
                });
                setComments(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchComments();
    }, [videoId]);

    async function submitComment() {
        if (!commentText.trim()) return;

        try {
            const res = await axios.post(
                `${BaseUrl}/comments`,
                { videoId, text: commentText },
                { withCredentials: true }
            );
            setComments((prev) => [res.data, ...prev]);
            setCommentText("");
        } catch (e) {
            console.error("Failed to post comment", e);
        }
    }

    async function deleteComment(id: string) {
        try {
            await axios.delete(`${BaseUrl}/comments/${id}`, {
                withCredentials: true,
            });
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {
            console.error("Error deleting comment", e);
        }
    }

    async function updateComment(id: string) {
        try {
            await axios.patch(
                `${BaseUrl}/comments/${id}`,
                { text: editingText },
                { withCredentials: true }
            );

            setComments((prev) =>
                prev.map((c) => (c.id === id ? { ...c, text: editingText } : c))
            );
            setEditingCommentId(null);
            setEditingText("");
        } catch (e) {
            console.error("Error updating comment", e);
        }
    }

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Comments</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 rounded bg-[#2a2929] text-white outline-none"
                />
                <button
                    onClick={submitComment}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Comment
                </button>
            </div>

            {loading ? (
                <div>Loading comments...</div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-[#2a2929] p-3 rounded flex gap-3"
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <img
                                    src={comment.user.picture}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="text-sm font-medium">
                                            {comment.user.username}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-1">
                                            {timeAgo(comment.createdAt)}
                                        </div>
                                    </div>
                                    {user?.id === comment.user.id && (
                                        <div className="flex gap-2 text-xs text-gray-400">
                                            <button
                                                onClick={() => {
                                                    setEditingCommentId(
                                                        comment.id
                                                    );
                                                    setEditingText(
                                                        comment.text
                                                    );
                                                }}
                                                className="hover:text-blue-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteComment(comment.id)
                                                }
                                                className="hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="flex flex-col gap-2 mt-2">
                                        <input
                                            type="text"
                                            value={editingText}
                                            onChange={(e) =>
                                                setEditingText(e.target.value)
                                            }
                                            className="p-2 rounded bg-[#1f1f1f] text-white outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    updateComment(comment.id)
                                                }
                                                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingCommentId(null)
                                                }
                                                className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-line">
                                        {comment.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
