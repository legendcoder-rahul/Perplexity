import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import googleIcon from '../../../assets/google.png'


const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    
    const [errorMsg, setErrorMsg] = useState('')
    const { loginUser } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        try {
            const result = await loginUser(formData)
            if (result?.user || result?.token) {
                navigate('/')
            }
        } catch (error) {
            setErrorMsg(error?.message || 'Login failed. Please try again.')
        }
    }
    
    const handleSocialLogin = (provider) => {
        console.log('Login with:', provider)
        // Add social login logic here
    }
    
    if (!loading && user) {
        return <Navigate to="/" replace />
    }
    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-slate-700 bg-black sticky top-0 z-10">
                <nav className="max-w-7xl mx-4 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">IndoAI</div>
                    <div className="flex gap-6 items-center">
                        <Link to="/auth/register" className="px-4 py-2 bg-white text-slate-900 rounded-md hover:bg-slate-100 font-medium">
                            Sign up
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Sign in</h1>
                        <p className="text-slate-400">Continue your journey with the intelligent search.</p>
                    </div>

                    {/* Social Login Options */}
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors font-medium text-slate-100"
                        >
                            <img className='h-6' src={googleIcon} alt="Google" />
                            Continue with Google
                        </button>

                    </div>

                    {/* Or Divider */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-400 font-medium">OR USE EMAIL</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg text-sm">
                                {errorMsg}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 border bg-transparent border-slate-600 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-slate-500 text-white"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-200">
                                    PASSWORD
                                </label>
                                <Link to="/forgot-password" className="text-sm text-slate-400 hover:text-slate-200 font-medium">
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border bg-transparent border-slate-600 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-slate-500 text-white"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            Sign in to Perplexity
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-slate-400 mt-8 font-medium">
                        Don't have an account?{' '}
                        <Link to="/auth/register" className="text-white font-bold hover:underline">
                            Create one for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login