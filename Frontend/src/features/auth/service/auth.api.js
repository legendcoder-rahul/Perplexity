import axios from "axios"

const api = axios.create({
    baseURL: 'https://perplexity-emwz.onrender.com',
    withCredentials: true
})

export async function register({email, username, password}) {
    try {
        const response = await api.post('/api/auth/register', { email, username, password })
        return response.data
    } catch (error) {
        console.error('Register error:', error.response?.data || error.message)
        throw error
    }
}

export async function login({email, password}) {
    try {
        const response = await api.post('/api/auth/login', { email, password })
        return response.data
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message)
        throw error
    }
}

export async function getMe(){
    try {
        const response = await api.get('/api/auth/get-me')
        return response.data
    } catch (error) {
        console.error('GetMe error:', error.response?.data || error.message)
        throw error
    }
}

export async function logout(){
        try {
            const response = await api.get('/api/auth/logout')
            return response.data
        } catch (error) {
            console.error('Logout error:', error.response?.data || error.message)
            throw error
        }
}