import React from "react";
import { Outlet, Link, useLocation, useParams } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, FileText, User } from "lucide-react";

export default function MobileLayout() {
    const { slug } = useParams();
    const location = useLocation();
    const activePath = location.pathname;

    const menus = [
        { icon: LayoutDashboard, label: "Home", path: `/${slug}/mobile/dashboard` },
        { icon: ShoppingBag, label: "Kasir", path: `/${slug}/mobile/pos` },
        { icon: FileText, label: "Laporan", path: `/${slug}/mobile/reports` },
        { icon: User, label: "Akun", path: `/${slug}/mobile/settings` },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-50">
                {menus.map((m, idx) => {
                    const isActive = activePath === m.path; // Strict equality check
                    return (
                        <Link 
                            key={idx} 
                            to={m.path} 
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <m.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-bold">{m.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
}