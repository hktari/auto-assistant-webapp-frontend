import http from "../http"

function mockUpdate(){
    return new Promise<string>((res, rej) => {
        setTimeout(() => res('OK'), 3000)
    })
}

function update(accountId: string, automationEnabled: boolean): Promise<string> {
    return mockUpdate()
    // todo: uncomment
    // return http.put(`/account/${accountId}`, {
    //     automationEnabled
    // })
}

const accountService = {
    update
}

export default accountService