import { AutomationAction, WorkweekConfiguration, WorkweekException } from '../../interface/common.interface'
import http from '../http'
import { dateToDayOfWeek } from '../util'


async function get(accountId: string): Promise<WorkweekConfiguration[]> {
    const responseDto: any[] = await http.get(`/account/${accountId}/workweek`)
    return responseDto.map(dto => mapDtoToModel(dto))
}

async function addOrUpdate(accountId: string, workweekConfig: WorkweekConfiguration[]): Promise<string> {
    try {
        await http.delete(`/account/${accountId}/workweek`)
    } catch (error) {
        console.debug('adding workweek configuration. None exists', error)
    }
    return await http.post(`/account/${accountId}/workweek`, mapWorkweekConfigToDto(workweekConfig))
}

function addException(accountId: string, { date, action }: WorkweekException): Promise<WorkweekException> {
    // format: YYYY-MM-DD
    const dateFormat = date.toISOString().substring(0, 10)
    return http.post(`/account/${accountId}/workweek-exception/`, {
        date: dateFormat,
        action,
        day: dateToDayOfWeek(date)
    })
}

function getExceptions(accountId: string): Promise<WorkweekException[]> {
    return http.get(`/account/${accountId}/workweek-exception`)
}

function removeException(accountId: string, workweekExceptionId: string): Promise<string> {
    return http.delete(`/account/${accountId}/workweek-exception/${workweekExceptionId}`)
}


/* --------------------------------- utility -------------------------------- */

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
export function mapWorkweekConfigToDto(workweekConfig: WorkweekConfiguration[]) {
    const tmp = new Map()

    for (const wwc of workweekConfig) {
        tmp.set(wwc.day, {
            start_at: wwc.startAt,
            end_at: wwc.endAt
        })
    }

    return {
        days: Object.fromEntries(tmp)
    }
}


function mapDtoToModel(dto: any): WorkweekConfiguration {
    if (!dto) {
        throw new Error('failed to map to WorkweekConfiguration: ' + dto)
    }

    return {
        day: dto.day,
        startAt: dto.start_at,
        endAt: dto.end_at
    }
}

const workweekConfigApi = {
    get,
    addOrUpdate,
    getExceptions,
    addException,
    removeException
}

export default workweekConfigApi