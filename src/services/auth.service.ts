
import http from './http'

function login(email: string, password: string): Promise<{ token: string, email: string, automationEnabled: boolean }> {
    return http.post('/login', {
        email,
        password
    })
}

function signup(email: string, password: string, automationEnabled: boolean): Promise<string> {
    return http.post('/signup', {
        email,
        password,
        automationEnabled
    })
}

const authService = {
    login,
    signup
}

export default authService