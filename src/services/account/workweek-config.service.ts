import { AutomationAction, WorkweekConfiguration, WorkweekException } from '../../interface/common.interface'
import http from '../http'
import { addTimeStringToDate, dateToDayOfWeek, localTimeStringToUTC, utcTimeStringToLocalTime } from '../util'


async function get(accountId: string): Promise<WorkweekConfiguration[]> {
    const responseDto: Dto[] = await http.get(`/account/${accountId}/workweek`)
    return responseDto.map(dto => mapDtoToModel(accountId, dto))
}

async function addOrUpdate(accountId: string, workweekConfig: WorkweekConfiguration[]): Promise<string> {
    try {
        await http.delete(`/account/${accountId}/workweek`)
    } catch (error) {
        console.debug('adding workweek configuration. None exists', error)
    }

    return await http.post(`/account/${accountId}/workweek`, mapWorkweekConfigToDto(workweekConfig))
}

function addExceptionForWorkweek(date: Date, workweekConfig: WorkweekConfiguration): Promise<WorkweekException[]> {
    const expectionPromises: Promise<WorkweekException>[] = []
    expectionPromises.push(addException(workweekConfig.accountId,
        { date: workweekConfig.getStartDatetime(date), action: AutomationAction.StartBtn }))

    expectionPromises.push(addException(workweekConfig.accountId, {
        date: workweekConfig.getEndDatetime(date), action: AutomationAction.StopBtn
    }))

    return Promise.all(expectionPromises)
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
 * Maps the WorkweekConfiguration object to the data transfer object.
 * Transforms local time strings to UTC
 * 
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
            start_at: localTimeStringToUTC(wwc.startAt),
            end_at: localTimeStringToUTC(wwc.endAt)
        })
    }

    return {
        days: Object.fromEntries(tmp)
    }
}

interface Dto {
    day: string

    // format: hh:mm
    start_at: string

    // format: hh:mm
    end_at: string
}

/**
 * Maps the DTO to WorkweekConfiguration object.
 * Converts time strings from UTC to local time
 * @param dto 
 * @returns 
 */
function mapDtoToModel(accountId: string, dto: Dto): WorkweekConfiguration {
    if (!dto) {
        throw new Error('failed to map to WorkweekConfiguration: ' + dto)
    }

    return new WorkweekConfiguration(accountId, dto.day, dto.start_at, dto.end_at)
}

const workweekConfigApi = {
    get,
    addOrUpdate,
    getExceptions,
    addException,
    removeException
}

export default workweekConfigApi