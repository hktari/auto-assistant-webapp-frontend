import http from "../http"

function update(accountId: string, automationEnabled: boolean): Promise<string> {
    return http.put(`/account/${accountId}`, {
        automationEnabled
    })
}

const accountService = {
    update
}

export default accountService