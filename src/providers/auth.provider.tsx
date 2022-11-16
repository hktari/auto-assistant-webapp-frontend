import { createContext, useContext, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { JWT, User } from "../interface/common.interface";
import authService from "../services/auth.service";
import { setAuthBearer } from "../services/http";

interface AuthContext {
    user: User | null
    login: (email: string, password: string) => Promise<User>
    logout: () => void
    signup: (email: string, password: string) => Promise<string>
    isLoggedIn: () => boolean
}

const AuthContext = createContext<AuthContext>({ user: null, login: null!, logout: null!, signup: null!, isLoggedIn: null! })


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const login = async (email: string, password: string) => {
        const { email: userEmail, automationEnabled, token } = await authService.login(email, password)

        const user = {
            email: userEmail,
            automationEnabled
        }

        setUser(user)
        setAccessToken({ token })

        return user
    }

    const logout = () => {
        clearAccessToken()
    }

    const signup = (email: string, password: string) => {
        return authService.signup(email, password, true)
    }

    const isLoggedIn = () => user !== null
    const value = { user, login, logout, signup, isLoggedIn }

    return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
}

export function useAuth() {
    return useContext(AuthContext)
}

export function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}



/* -------------------------- <access token handling> ------------------------- */

function getValidTokenOrNull() {
    const jwtJSON = localStorage.getItem('jwt')

    if (jwtJSON) {
        const jwt = JSON.parse(jwtJSON)
        return jwt.token

        // const jwt = JSON.parse(jwtJSON, (key, val) => {
        //     if (key === 'expiresAt') {
        //         return new Date(val)
        //     }
        //     return val
        // }) as JWT

        // if (jwt.expiresAt && jwt.expiresAt.getTime() > Date.now()) {
        //     return jwt.token
        // } else {
        //     return null
        // }
    }

    return null
}

function setAccessToken(jwt: JWT) {
    localStorage.setItem("jwt", JSON.stringify(jwt));
    setAuthBearer(jwt.token)
}

function clearAccessToken() {
    localStorage.setItem("jwt", "");
    setAuthBearer('')
}

/* -------------------------- </access token handling> ------------------------- */


export default AuthProvider