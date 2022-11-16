
import http from './http'

function login(email: string, password: string) {
    return http.post('/login', {
        email,
        password
    })
}

function signup(email: string, password: string, automationEnabled: boolean) {
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