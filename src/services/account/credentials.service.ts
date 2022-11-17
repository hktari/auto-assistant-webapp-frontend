import { Credentials } from "../../interface/common.interface"
import http from "../http"



function getCredentials(accountId: string): Promise<Credentials> {
    return http.get(`/account/${accountId}/login-info`)
}

function addCredentials(accountId: string, username: string, password: string): Promise<string> {
    return http.post(`/account/${accountId}/login-info`, {
        username,
        password
    })
}

function updateCredentials(accountId: string, username : string, password: string): Promise<string>{
    return http.put(`/account/${accountId}/login-info`, {
        username,
        password
    })
}

function deleteCredentials(accountId: string): Promise<string> {
    return http.delete(`/account/${accountId}/login-info`)
}

const credentialsService = {
    addCredentials,
    deleteCredentials,
    updateCredentials,
    getCredentials
}

export default credentialsService