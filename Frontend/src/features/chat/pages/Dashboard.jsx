import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const recentHistory = [
    { id: 1, title: 'Post-Quantum Cryptogr...', bg: 'bg-indigo-950' },
    { id: 2, title: 'LLM Edge Optimization', bg: 'bg-emerald-950' },
    { id: 3, title: 'Rust API implementation', bg: 'bg-slate-800' },
    { id: 4, title: 'Philosophy of AI', bg: 'bg-violet-950' },
    { id: 5, title: 'Market trend analysis', bg: 'bg-blue-950' },
]

// ── Icons ──────────────────────────────────────────────────────────────────
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
const GlobeIcon = () => (
    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)
const AttachIcon = () => (
    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
)
const SendIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
)
const SettingsIcon = () => (
    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
)
const MenuIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)
const CloseIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

// ── Sidebar Content (reused in desktop sidebar & mobile drawer) ────────────
const SidebarContent = ({ activeNav, setActiveNav, onNavClick }) => {
    const navItems = [
        { label: 'Home', icon: <HomeIcon /> },
        { label: 'Discover', icon: <DiscoverIcon /> },
        { label: 'Library', icon: <LibraryIcon /> },
    ]

    return (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-5 pt-6 pb-5">
                <p className="font-bold text-[18px] tracking-tight text-slate-50"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    IndoAI
                </p>
                <p className="text-[9px] tracking-[3px] uppercase text-slate-600 mt-0.5">
                    The Curator
                </p>
            </div>

            {/* New Thread */}
            <button className="mx-3 mb-5 flex items-center justify-between px-3 py-2.5 rounded-[9px]
                         bg-indigo-500/10 border border-indigo-500/[0.22] text-indigo-300
                         text-[13px] font-medium cursor-pointer
                         hover:bg-indigo-500/[0.18] hover:border-indigo-500/40 transition-all">
                New Thread
                <EditIcon />
            </button>

            {/* Nav */}
            <nav className="px-2 space-y-0.5">
                {navItems.map(({ label, icon }) => (
                    <button
                        key={label}
                        onClick={() => { setActiveNav(label); onNavClick?.() }}
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

            {/* History */}
            <p className="px-5 pt-5 pb-2 text-[9px] tracking-[2.5px] uppercase text-slate-700 font-medium">
                Recent History
            </p>

            <div className="space-y-0.5 overflow-y-auto flex-1">
                {recentHistory.map(item => (
                    <div key={item.id}
                        className="flex items-center gap-2.5 px-3 py-1.5 mx-2 rounded-[7px]
                          cursor-pointer hover:bg-white/[0.04] transition-all">
                        <div className={`w-[26px] h-[26px] rounded-[7px] shrink-0 ${item.bg}`} />
                        <span className="text-[12px] text-slate-600 truncate">{item.title}</span>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.05] p-3 pt-4">
                <button className="w-full flex items-center gap-2 px-2 py-2 rounded-[7px] text-slate-600
                           text-[12.5px] hover:text-slate-500 hover:bg-white/[0.03] transition-all mb-2">
                    <SettingsIcon /> Settings
                </button>
                <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.07]
                        rounded-[10px] p-2.5 cursor-pointer hover:bg-white/[0.05] transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500
                          flex items-center justify-center text-[13px] font-semibold text-white shrink-0">
                        TC
                    </div>
                    <div>
                        <p className="text-[12.5px] font-medium text-slate-400">The Curator</p>
                        <p className="text-[8.5px] tracking-[1.5px] uppercase text-indigo-500 font-semibold">Pro</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
    const chat = useChat()
    const { user } = useSelector(state => state.auth)

    const [activeNav, setActiveNav] = useState('Home')
    const [query, setQuery] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)

    // 🔥 NEW STATES
    const [messages, setMessages] = useState([])
    const [hasStartedChat, setHasStartedChat] = useState(false)

    const bottomRef = useRef(null)

    useEffect(() => {
        if (chat) chat.initializeSocketConnection()
    }, [chat])

    // auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // send message
    const handleSend = () => {
        if (!query.trim()) return

        const userMsg = {
            id: Date.now(),
            text: query,
            sender: 'user'
        }

        setMessages(prev => [...prev, userMsg])
        setHasStartedChat(true)
        setQuery('')

        // dummy bot reply
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, text: 'AI response 🤖', sender: 'bot' }
            ])
        }, 700)
    }

    return (
        <div className="flex min-h-screen bg-[#000] text-slate-200 font-sans">

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden md:flex w-[230px] min-h-screen bg-[#000] border-r border-white/[0.06] flex-col shrink-0">
                <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} />
            </aside>

            {/* ── MOBILE DRAWER BACKDROP ── */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* ── MOBILE DRAWER ── */}
            <div className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[#0a0a0a]
                       border-r border-white/[0.06] shadow-2xl
                       transform transition-transform duration-300 ease-in-out md:hidden
                       ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <button
                    onClick={() => setDrawerOpen(false)}
                    className="absolute top-4 right-4 text-slate-500"
                >
                    ✕
                </button>

                <SidebarContent
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                    onNavClick={() => setDrawerOpen(false)}
                />
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* HEADER */}
                <header className="flex items-center px-4 md:px-8 py-3 border-b border-white/[0.05]">
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="md:hidden mr-2"
                    >
                        ☰
                    </button>
                    <span className="text-white font-semibold">IndoAI</span>
                </header>

                {/* ── CHAT MESSAGES ── */}
                <div className={`flex-1 w-full max-w-[800px] mx-auto px-4
          ${hasStartedChat ? 'pt-6 pb-32' : 'hidden'}`}>

                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-2xl text-sm max-w-[70%]
                  ${msg.sender === 'user'
                                        ? 'bg-indigo-500 text-white rounded-br-sm'
                                        : 'bg-white/10 text-slate-200 rounded-bl-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    <div ref={bottomRef} />
                </div>

                {/* ── CENTER UI (FIRST LOAD) ── */}
                {!hasStartedChat && (
                    <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">

                        <h1 className="text-[clamp(26px,5vw,52px)] font-bold text-white text-center">
                            Where knowledge begins.
                        </h1>

                        <div className="flex gap-2 flex-wrap justify-center">
                            {['Deep Research', 'Technical Analysis', 'Creative Synthesis'].map(chip => (
                                <button
                                    key={chip}
                                    className="px-4 py-1.5 rounded-full border border-white/10 text-slate-500
                             hover:text-indigo-300 hover:border-indigo-500"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── INPUT BOX ── */}
                <div className={`w-full max-w-[660px] mx-auto px-4
          ${hasStartedChat
                        ? 'fixed bottom-6 left-1/2 -translate-x-1/2'
                        : 'mb-10'
                    }`}>

                    <div className="bg-white/[0.04] border border-white/10 rounded-[14px]">

                        <textarea
                            rows={2}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent outline-none resize-none
                         text-slate-200 px-4 pt-4 pb-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                        />

                        <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 pb-3.5">
                            <button className="flex items-center gap-1.5 text-slate-600 text-[12px] md:text-[12.5px]
                                 px-2 py-1 rounded-md hover:text-slate-400
                                 hover:bg-white/[0.04] transition-all cursor-pointer whitespace-nowrap">
                                <GlobeIcon />
                                <span className="hidden sm:inline">Focus:</span> All
                                line
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-600 text-[12px] md:text-[12.5px]
                                 px-2 py-1 rounded-md hover:text-slate-400
                                 hover:bg-white/[0.04] transition-all cursor-pointer">
                                <AttachIcon />
                                <span className="hidden sm:inline">Attach</span>
                            </button>
                            <button className="ml-auto w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500
                                 flex items-center justify-center hover:bg-indigo-400 hover:scale-105
                                 transition-all cursor-pointer shrink-0">
                                <SendIcon />
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard