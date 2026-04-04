import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { useChat } from '../hooks/useChat'
import { SidebarContent } from '../../components/Sidebar'


const GlobeIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
)

const AttachIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 0 18.8-4.3M22 12.5a10 10 0 0 0-18.8 4.2" />
    </svg>
)

const SendIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654304,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.19218622,10.7522035 3.50612381,10.7522035 L16.6915026,11.5376905 C16.6915026,11.5376905 17.1624089,11.5376905 17.1624089,12.0089827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
    </svg>
)

const MenuIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
)

const Dashboard = () => {
    const chat = useChat()
    const { user } = useSelector(state => state.auth)
    const { chats, currentChatId, error: reduxError } = useSelector(state => state.chat)
    const currentChat = currentChatId ? chats[currentChatId] : null
    const messages = currentChat?.messages || []

    const [activeNav, setActiveNav] = useState('Home')
    const [query, setQuery] = useState('')
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [errorMsg, setErrorMsg] = useState('')
    const bottomRef = useRef(null)
    const messagesContainerRef = useRef(null)

    // Handle Redux error state
    useEffect(() => {
        if (reduxError) {
            setErrorMsg(reduxError)
            const timer = setTimeout(() => setErrorMsg(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [reduxError])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (chat) {
            chat.handleGetChats()
        }

    }, []) // Only run once on component mount

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        console.log('📊 Chat state updated:', { currentChatId, messagesCount: messages.length, messages })
    }, [currentChatId, messages])

    const handleSend = async () => {
        if (!query.trim()) return

        const trimmedQuery = query.trim()
        console.log('📤 Attempting to send message:', { trimmedQuery, currentChatId })
        setQuery('')
        setErrorMsg('')
        
        try {
            console.log('Sending message from Dashboard:', trimmedQuery)
            await chat.handleSendMessage({ message: trimmedQuery, chatId: currentChatId })
            console.log('✅ Message sent successfully. New currentChatId:', currentChatId)
        } catch (error) {
            console.error('Failed to send message:', error)
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send message'
            setErrorMsg(errorMessage)
            setQuery(trimmedQuery) // restore query on error
        }
    }

    
    return (
        <div className="flex min-h-screen bg-[#000] text-slate-200 font-sans">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-[230px] min-h-screen bg-[#000] border-r border-white/[0.06] flex-col shrink-0">
                <div className="px-4 py-4 border-b border-white/[0.05]">
                    <span className="text-white text-lg font-bold">IndoAI</span>
                </div>
                <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} />
            </aside>

            {/* MOBILE DRAWER BACKDROP */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* MOBILE DRAWER SIDEBAR */}
            <div className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[#0a0a0a]
                       border-r border-white/[0.06] shadow-2xl overflow-y-auto
                       transform transition-transform duration-300 ease-in-out md:hidden
                       ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.05]">
                    <span className="text-white text-lg font-bold">IndoAI</span>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-1.5 hover:bg-white/[0.08] rounded-lg transition-all text-slate-400 hover:text-slate-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <SidebarContent
                    activeNav={activeNav}
                    setActiveNav={setActiveNav}
                    onNavClick={() => setDrawerOpen(false)}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* HEADER */}
                <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/[0.05] bg-[#000]/95 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            className="md:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-all"
                        >
                            <MenuIcon />
                        </button>
                        <span className="text-white text-xl font-semibold">IndoAI</span>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button className="text-[11px] font-medium tracking-[1.5px] uppercase text-slate-600 px-2 py-1 rounded hover:text-slate-400">
                            Search
                        </button>
                        <button className="text-[11px] font-medium tracking-[1.5px] uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded hover:bg-indigo-500/20">
                            Upgrade
                        </button>
                    </div>
                </header>

                {/* ERROR MESSAGE */}
                {errorMsg && (
                    <div className="bg-red-500/10 border-b border-red-500/30 text-red-400 px-4 md:px-8 py-3 flex items-start gap-2">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm flex-1">{errorMsg}</span>
                        <button 
                            onClick={() => setErrorMsg('')}
                            className="text-red-400 hover:text-red-300 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* CHAT MESSAGES CONTAINER */}
                <div
                    ref={messagesContainerRef}
                    className={`flex-1 w-full overflow-y-auto ${messages.length > 0 ? 'block' : 'hidden'}`}
                >
                    <div className="max-w-[800px] mx-auto px-4 py-6 pb-32">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[70%] md:max-w-[60%] text-sm leading-relaxed
                      ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                            : 'bg-white/[0.08] text-slate-200 rounded-bl-sm border border-white/10'
                                        }`}
                                >
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                code: ({ node, inline, ...props }) => inline ? 
                                                    <code className="bg-white/[0.1] px-1.5 py-0.5 rounded text-yellow-300 font-mono text-xs" {...props} /> :
                                                    <code className="bg-white/[0.1] px-2 py-1 rounded block my-2 text-yellow-300 font-mono text-xs" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-indigo-500 pl-3 italic my-2" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-indigo-400 hover:underline" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* CENTER UI (FIRST LOAD) */}
                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6 pb-32">
                        <h1 className="text-[clamp(28px,5vw,52px)] font-bold text-white text-center leading-tight">
                            Where knowledge begins.
                        </h1>

                        <div className="flex gap-2 flex-wrap justify-center max-w-md">
                            {['Deep Research', 'Technical Analysis', 'Creative Synthesis'].map(chip => (
                                <button
                                    key={chip}
                                    className="px-3 md:px-4 py-1.5 rounded-full border border-white/10 text-slate-500 text-xs md:text-sm
                             hover:text-indigo-300 hover:border-indigo-500/40 transition-all"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* INPUT BOX - STICKY AT BOTTOM */}
                <div className="fixed bottom-0 left-0 right-0 md:pl-[230px] bg-gradient-to-t from-[#000] via-[#000] to-transparent pt-6 pb-4 px-4 md:px-8">
                    <div className="max-w-[660px] mx-auto">
                        <div className="bg-white/[0.04] border border-white/10 rounded-[14px] overflow-hidden
                                      focus-within:border-indigo-500/40 focus-within:bg-white/[0.06] transition-all">

                            <textarea
                                rows={2}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full bg-transparent outline-none resize-none
                             text-slate-200 text-sm md:text-base px-4 pt-4 pb-2
                             placeholder:text-slate-700"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend()
                                    }
                                }}
                            />

                            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 pb-3">
                                <button className="flex items-center gap-1.5 text-slate-600 text-xs md:text-sm
                                     px-2 py-1 rounded-md hover:text-slate-400 hover:bg-white/[0.04] transition-all whitespace-nowrap">
                                    <GlobeIcon />
                                    <span className="hidden sm:inline">Focus:</span> All
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-600 text-xs md:text-sm
                                     px-2 py-1 rounded-md hover:text-slate-400 hover:bg-white/[0.04] transition-all">
                                    <AttachIcon />
                                    <span className="hidden sm:inline">Attach</span>
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!query.trim()}
                                    className="ml-auto w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500
                                         flex items-center justify-center hover:bg-indigo-400 hover:scale-105
                                         transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SendIcon />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard