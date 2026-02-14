// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Sidebar from './sidebar';
// import Navbar from './navbar';

// const Layout = () => {
//     return (
//         <div className="flex min-h-screen bg-[#0B1120]">
//             <Sidebar />
//             <div className="flex-1 ml-64">
//                 <Navbar />
//                 <main className="p-8">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Layout;


import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = () => {
    // Mobile par sidebar toggle karne ke liye state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0B1120] relative">
            {/* Sidebar: Mobile par hidden rahega jab tak toggle na ho, Desktop par hamesha dikhega */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:static md:inset-0 
                transition-transform duration-300 ease-in-out
                w-64 bg-[#0B1120] border-r border-slate-800
            `}>
                <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {/* Overlay: Mobile par sidebar khulne par background dark karne ke liye */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar ko toggle function pass kiya hai taaki hamburger button chal sake */}
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;