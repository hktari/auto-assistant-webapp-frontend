export interface JWT {
    token: string
}


export interface User {
    email: string
    automationEnabled: boolean
}

export interface Credentials {
    id: string,
    email: string,
    username: string,
    password_cipher: string,
    iv_cipher: string
}