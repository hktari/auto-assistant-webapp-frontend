import { createContext, useContext, useState } from "react";


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

export default AuthProvider