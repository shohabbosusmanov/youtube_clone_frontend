import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MyVideosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex-1 flex">
                <Sidebar />
                <main>{children}</main>
            </div>
        </div>
    );
}
