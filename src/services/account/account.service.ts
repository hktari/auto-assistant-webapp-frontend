import { User } from "../../interface/common.interface"
import http from "../http"

function mockUpdate() {
    return new Promise<string>((res, rej) => {
        setTimeout(() => res('OK'), 3000)
    })
}

function update(accountId: string, automationEnabled: boolean): Promise<string> {
    return http.put(`/account/${accountId}`, {
        automationEnabled
    })
}

function getMyAccount(): Promise<User> {
    return http.get('/account/logged-in')
}

const accountService = {
    getMyAccount,
    update
}

export default accountService