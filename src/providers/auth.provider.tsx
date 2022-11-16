import { createContext, useContext, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";


interface User {

}
interface AuthContext {
    user: User | null
    login: (email: string, password: string) => Promise<User>
    logout: () => void
}

const AuthContext = createContext<AuthContext>(
    { user: null, login: (email: string, password: string) => undefined!, logout: () => undefined })


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const login = (email: string, password: string) => {
        const user: User = {}
        return Promise.resolve(user)
    }

    const logout = () => {

    }

    const value = { user, login, logout }

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

export default AuthProvider