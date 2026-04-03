import { useDispatch } from "react-redux";
import { register, login, getMe ,logout} from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch()

    const registerUser = async ({ email, username, password }) => {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            if (data.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Registration failed'
            dispatch(setError(errorMsg))
            throw new Error(errorMsg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const loginUser = async ({ email, password }) => {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            if (data.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Login failed'
            dispatch(setError(errorMsg))
            throw new Error(errorMsg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            if (data.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch user data'
            dispatch(setError(errorMsg))
            throw new Error(errorMsg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true))
            const data = await logout()
            dispatch(setUser(null))
            return data
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Logout failed'
            dispatch(setError(errorMsg))
            throw new Error(errorMsg)
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        registerUser,
        loginUser,
        handleGetMe,
        logoutUser
    }
}
