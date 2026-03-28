import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { useEffect } from 'react'

const Dashboard = () => {

    const chat = useChat()

    const { user } = useSelector(state => state.auth)
    console.log('Dashboard user:', user)

    useEffect(() => {
        chat.initializeSocketConnection()
    }, [])

    return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome to Perplexity</h1>
            <p className="text-slate-400 text-lg">Intelligent search at your fingertips</p>
        </div>
    </div>

    )
}
export default Dashboard