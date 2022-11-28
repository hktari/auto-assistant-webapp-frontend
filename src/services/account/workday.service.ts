import { WorkdayConfiguration } from '../../interface/common.interface'
import http from '../http'
import { dateToDateString, localTimeStringToUTC, utcTimeStringToLocalTime as utcTimeStringToLocalTime } from '../util'

async function all(accountId: string): Promise<WorkdayConfiguration[]> {
    const dto: Dto[] = await http.get(`/account/${accountId}/workday`)
    return dto.map(d => dtoToModel(accountId, d))
}

async function add(workdayConfig: WorkdayConfiguration): Promise<WorkdayConfiguration> {
    const dto = mapToDto(workdayConfig)
    const resultDto: Dto = await http.post(`/account/${workdayConfig.accountId}/workday`, dto)
    return dtoToModel(workdayConfig.accountId, resultDto)
}

function remove(workdayConfig: WorkdayConfiguration): Promise<string> {
    return http.delete(`/account/${workdayConfig.accountId}/workday/${workdayConfig.id}`)
}

async function addOrUpdate(workdayConfig: WorkdayConfiguration): Promise<WorkdayConfiguration> {
    try {
        if (workdayConfig.id) {
            console.debug('wokday.service', 'remove before add')
            await remove(workdayConfig)
        }
    } catch (error) {
        console.debug('workday.service', error)
    }

    console.debug('workday.service', 'add')
    return await add(workdayConfig)
}

/* --------------------------------- utility -------------------------------- */


interface Dto {
    id?: string
    day?: string,
    login_info_id?: string,

    // format: YYY-MM-DD
    date: string,

    // format: hh:mm
    start_at: string,

    // format: hh:mm
    end_at: string
}

/**
 * Maps the WorkdayConfiguration object to DTO.
 * Transforms time strings from local time to UTC 
 * @param workdayConfig 
 */
function mapToDto(workdayConfig: WorkdayConfiguration): Dto {
    return {
        id: workdayConfig.id,
        day: workdayConfig.day,
        login_info_id: workdayConfig.loginInfoId,

        // format: YYY-MM-DD
        date: dateToDateString(workdayConfig.date),

        // format: hh:mm
        start_at: localTimeStringToUTC(workdayConfig.startAt),

        // format: hh:mm
        end_at: localTimeStringToUTC(workdayConfig.endAt)
    }
}

/**
 * Maps the dto to WorkdayConfiguration object
 * Transforms time strings from UTC to local time
 * @param dto 
 * @returns 
 */
function dtoToModel(accountId: string, dto: Dto): WorkdayConfiguration {
    return {
        id: dto.id,
        day: dto.day,
        accountId,
        loginInfoId: dto.login_info_id,
        date: new Date(dto.date),
        startAt: utcTimeStringToLocalTime(dto.start_at),
        endAt: utcTimeStringToLocalTime(dto.end_at)
    }
}

const workdayApi = {
    all,
    addOrUpdate,
    remove
}

export default workdayApi