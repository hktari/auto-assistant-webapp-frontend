import { domainToASCII } from 'url'
import { AutomationAction, WorkweekConfiguration, WorkweekException } from '../../interface/common.interface'
import http from '../http'
import { addTimeStringToDate, dateToDayOfWeek, localTimeStringToUTC, utcTimeStringToLocalTime } from '../util'


async function get(accountId: string): Promise<WorkweekConfiguration[]> {
    const responseDto: Dto[] = await http.get(`/account/${accountId}/workweek`)
    return responseDto.map(dto => mapDtoToWorkweekConfig(accountId, dto))
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
        workweekConfig.getStartDatetime(date), AutomationAction.StartBtn))

    expectionPromises.push(addException(workweekConfig.accountId,
        workweekConfig.getEndDatetime(date), AutomationAction.StopBtn))

    return Promise.all(expectionPromises)
}

async function addException(accountId: string, date: Date, action: AutomationAction): Promise<WorkweekException> {
    // format: YYYY-MM-DD
    const dateFormat = date.toISOString().substring(0, 10)
    const resultDto: any = await http.post(`/account/${accountId}/workweek-exception/`, {
        date: dateFormat,
        action,
        day: dateToDayOfWeek(date)
    })

    return mapDtoToWorkweekException(accountId, resultDto)

}

async function getExceptions(accountId: string): Promise<WorkweekException[]> {
    const resultDtos: any[] = await http.get(`/account/${accountId}/workweek-exception`)
    return resultDtos.map(dto => mapDtoToWorkweekException(accountId, dto))
}

function removeException(workweekException: WorkweekException): Promise<string> {
    return http.delete(`/account/${workweekException.accountId}/workweek-exception/${workweekException.id}`)
}


/* --------------------------------- utility -------------------------------- */

interface Dto {
    day: string

    // format: hh:mm
    start_at: string

    // format: hh:mm
    end_at: string
}

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


/**
 * Maps the DTO to WorkweekConfiguration object.
 * Converts time strings from UTC to local time
 * @param dto 
 * @returns 
 */
function mapDtoToWorkweekConfig(accountId: string, dto: Dto): WorkweekConfiguration {
    if (!dto) {
        throw new Error('failed to map to WorkweekConfiguration: ' + dto)
    }

    return new WorkweekConfiguration(accountId, dto.day, utcTimeStringToLocalTime(dto.start_at), utcTimeStringToLocalTime(dto.end_at))
}

function mapDtoToWorkweekException(accountId: string, dto: any): WorkweekException {
    return {
        id: dto.id,
        accountId,
        action: dto.action,
        date: dto.date,
    }
}

const workweekConfigApi = {
    get,
    addOrUpdate,
    getExceptions,
    addExceptionForWorkweek,
    removeException
}

export default workweekConfigApi