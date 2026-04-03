import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../auth/hook/useAuth'


const HomeIcon = ({ className = 'w-4 h-4 shrink-0' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)

const DiscoverIcon = ({ className = 'w-4 h-4 shrink-0' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const LibraryIcon = ({ className = 'w-4 h-4 shrink-0' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
)

const EditIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
)

const SettingsIcon = () => (
    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
)

const recentHistory = [
    { id: 1, title: 'Post-Quantum Cryptogr...', bg: 'bg-indigo-950' },
    { id: 2, title: 'LLM Edge Optimization', bg: 'bg-emerald-950' },
    { id: 3, title: 'Rust API implementation', bg: 'bg-slate-800' },
    { id: 4, title: 'Philosophy of AI', bg: 'bg-violet-950' },
    { id: 5, title: 'Market trend analysis', bg: 'bg-blue-950' },
]

export const SidebarContent = ({ activeNav, setActiveNav, onNavClick }) => {
    const { user } = useSelector(state => state.auth || {})
    const { logoutUser } = useAuth()
    const navItems = [
        { label: 'Home', icon: <HomeIcon /> },
        { label: 'Discover', icon: <DiscoverIcon /> },
        { label: 'Library', icon: <LibraryIcon /> },
    ]

    return (      
    <div className="bg-transparent flex-1 flex flex-col">
            {/* New Thread Button */}
            <button className="mx-3 mb-5 flex mt-5 items-center justify-between px-3 py-2.5 rounded-[9px]
                         bg-indigo-500/10 border border-indigo-500/[0.22] text-indigo-300
                         text-[13px] font-medium cursor-pointer
                         hover:bg-indigo-500/[0.18] hover:border-indigo-500/40 transition-all">
                New Thread
                <EditIcon />
            </button>

            {/* Navigation */}
            <nav className="px-2 space-y-0.5">
                {navItems.map(({ label, icon }) => (
                    <button
                        key={label}
                        onClick={() => {
                            setActiveNav(label)
                            onNavClick?.()
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px]
                        transition-all cursor-pointer font-normal text-left
                        ${activeNav === label
                                ? 'bg-indigo-500/10 text-indigo-300'
                                : 'text-slate-600 hover:bg-white/[0.04] hover:text-slate-400'}`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </nav>

            {/* Recent History Header */}
            <p className="px-5 pt-5 pb-2 text-[9px] tracking-[2.5px] uppercase text-slate-700 font-medium">
                Recent History
            </p>

            {/* Recent Chats List */}
            <div className="space-y-0.5 overflow-y-auto flex-1 px-2 ">
                {recentHistory.map(item => (
                    <button
                        key={item.id}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-[7px]
                                   cursor-pointer hover:bg-white/[0.04] transition-all group"
                    >
                        <div className={`w-[26px] h-[26px] rounded-[7px] shrink-0 ${item.bg}`} />
                        <span className="text-[12px] text-slate-600 group-hover:text-slate-500 truncate text-left">
                            {item.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.05] p-3 pt-4 mt-auto">
                {/* Settings Button */}
                <button className="w-full flex items-center gap-2 px-2 py-2 rounded-[7px] text-slate-600
                           text-xs hover:text-slate-500 hover:bg-white/[0.03] transition-all mb-2">
                    <SettingsIcon />
                    Settings
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-2.5 absolute bottom-3 left-3 right-3 bg-white/[0.03] border border-white/[0.07]
                        rounded-[10px] p-2.5 cursor-pointer hover:bg-white/[0.05] transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500
                          flex items-center justify-center text-[13px] font-semibold text-white shrink-0">
                        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400 truncate">
                            {user?.username || 'User'}
                        </p>
                        <p className="text-[9px] tracking-[1.5px] uppercase text-indigo-500 font-semibold">Pro</p>
                    </div>
                    <button 
                        className="text-[12px] font-medium text-slate-600 hover:text-slate-400 transition-all ml-auto"
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SidebarContent