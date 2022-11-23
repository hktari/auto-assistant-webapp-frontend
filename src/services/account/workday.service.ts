import { WorkdayConfiguration } from '../../interface/common.interface'
import http from '../http'

async function all(accountId: string) {
    return http.get(`/account/${accountId}/workday`)
}

function add(accountId: string, workdayConfig: WorkdayConfiguration): Promise<WorkdayConfiguration[]> {
    return http.post(`/account/${accountId}/workday`, workdayConfig)
}

function remove(accountId: string, workdayConfigId: string) : Promise<string> {
    return http.delete(`/account/${accountId}/workday/${workdayConfigId}`)
}

const workdayApi = {
    all,
    add,
    remove
}

export default workdayApi