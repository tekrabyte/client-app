import React from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { Home, FileText, User, Box, ShoppingCart } from "lucide-react";

export default function MobileLayout() {
    const { slug } = useParams();
    const location = useLocation();
    const activePath = location.pathname;

    const menus = [
        { icon: Home, label: "Beranda", path: `/${slug}/mobile/dashboard` },
        { icon: FileText, label: "Laporan", path: `/${slug}/mobile/reports` },
        { icon: ShoppingCart, label: "POS", path: `/${slug}/mobile/pos`, isMain: true },
        { icon: Box, label: "Stok", path: `/${slug}/mobile/inventory` },
        { icon: User, label: "Akun", path: `/${slug}/mobile/settings` },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
            <main className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-gray-50">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe pt-1 px-2 flex justify-between items-end z-50 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] h-[70px]">
                {menus.map((m, idx) => {
                    const isActive = activePath === m.path;
                    
                    if (m.isMain) {
                        return (
                            <Link key={idx} to={m.path} className="relative -top-6 flex flex-col items-center justify-center w-1/5">
                                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-gray-50 active:scale-95 transition-transform">
                                    <m.icon size={24} className="text-white" strokeWidth={2.5} />
                                </div>
                                <span className={`text-[10px] font-bold mt-1 ${isActive ? "text-primary" : "text-gray-500"}`}>{m.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <Link 
                            key={idx} 
                            to={m.path} 
                            className={`flex flex-col items-center justify-center gap-1 h-full pb-3 w-1/5 transition-colors ${
                                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <m.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{m.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}