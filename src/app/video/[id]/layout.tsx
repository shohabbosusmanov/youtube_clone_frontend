import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MyVideosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col">
            <div className=" sticky top-0 z-50 bg-[#0f0f0f] opacity-90 shadow">
                <Header />
            </div>
            <main className="flex flex-1 overflow-hidden justify-center">
                <div className=" self-start h-full sticky top-0 bg-[#0f0f0f] overflow-auto shadow">
                    <Sidebar />
                </div>
                <div className="flex-1 h-full overflow-y-auto p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
