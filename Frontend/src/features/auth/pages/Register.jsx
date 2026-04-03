import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth.js'
import googleIcon from '../../../assets/google.png'


const Register = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { registerUser } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      await registerUser({ 
        username: formData.name,
        email: formData.email, 
        password: formData.password 
      })
      navigate('/')
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed' })
    }
  }

  const handleSocialSignUp = (provider) => {
    console.log('Sign up with:', provider)
    // Add social signup logic here
  }

  return (
    <div className="min-h-screen bg-black to-slate-950">
      {/* Header */}
      <header className="border-b border-gray-600 bg-black sticky top-0 z-10">
        <nav className="max-w-7xl mx-4 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">IndoAI</div>
          <div className="flex gap-6 items-center">
            
            <Link to="/auth/login" className="px-4 py-2 bg-white hover:bg-slate-100 rounded-md font-medium">
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Join us and start exploring the intelligent search.</p>
          </div>

          {/* Social Sign Up Options */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleSocialSignUp('google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors font-medium text-slate-100"
            >
             <img className='h-6' src={googleIcon} alt="Google" />
              Sign up with Google
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
            {errors.submit && (
              <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border bg-transparent border-slate-600 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-slate-500 text-white"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

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
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border bg-transparent border-slate-600 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-slate-500 text-white"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border bg-transparent  border-slate-600 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-slate-500 text-white"
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-slate-400 mt-8 font-medium">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-white font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register