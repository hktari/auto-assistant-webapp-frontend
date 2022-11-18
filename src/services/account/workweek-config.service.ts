import { WorkweekConfiguration } from '../../interface/common.interface'
import http from '../http'

function get(accountId: string): Promise<WorkweekConfiguration[]> {
    return http.get(`/account/${accountId}/workweek`)
}



/**
 * Output:
 * {
    "days": {
        "mon": {
            "start_at": "15:30",
            "end_at": "15:40"
        },
        ...
    }
 */
export function mapWorkweekConfigToPayload(workweekConfig: WorkweekConfiguration[]) {
    const tmp = new Map()

    for (const wwc of workweekConfig) {
        tmp.set(wwc.day, {
            start_at: wwc.startAt,
            end_at: wwc.endAt
        })
    }

    return {
        days: tmp
    }
}

async function addOrUpdate(accountId: string, workweekConfig: WorkweekConfiguration[]): Promise<string> {
    try {
        await http.delete(`/account/${accountId}/workweek`)
    } catch (error) {
        console.debug('adding workweek configuration. None exists', error)
    }

    return await http.post(`/account/${accountId}/workweek`, mapWorkweekConfigToPayload(workweekConfig))
}

const workweekConfigApi = {
    get,
    addOrUpdate
}

export default workweekConfigApi