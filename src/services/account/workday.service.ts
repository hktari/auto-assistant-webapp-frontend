import { WorkdayConfiguration } from '../../interface/common.interface'
import http from '../http'
import { dateToDateString, localTimeStringToUTC, timeStringToLocalTime as utcTimeStringToLocalTime } from '../util'

async function all(accountId: string): Promise<WorkdayConfiguration[]> {
    const dto : WorkdayConfigurationDto[] = await http.get(`/account/${accountId}/workday`)
    return dto.map(d => dtoToModel(d))
}

function add(accountId: string, workdayConfig: WorkdayConfiguration): Promise<WorkdayConfiguration[]> {
    return http.post(`/account/${accountId}/workday`, workdayConfig)
}

function remove(accountId: string, workdayConfigId: string): Promise<string> {
    return http.delete(`/account/${accountId}/workday/${workdayConfigId}`)
}

/* --------------------------------- utility -------------------------------- */


/**
 * Maps the WorkdayConfiguration object to DTO.
 * Transforms time strings from local time to UTC 
 * @param workdayConfig 
 */
function mapToDto(workdayConfig: WorkdayConfiguration): WorkdayConfigurationDto {
    return {
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

interface WorkdayConfigurationDto {
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
 * Maps the dto to WorkdayConfiguration object
 * Transforms time strings from UTC to local time
 * @param dto 
 * @returns 
 */
function dtoToModel(dto: WorkdayConfigurationDto): WorkdayConfiguration {
    return {
        day: dto.day,
        loginInfoId: dto.login_info_id,
        date: new Date(dto.date),
        startAt: utcTimeStringToLocalTime(dto.start_at),
        endAt: utcTimeStringToLocalTime(dto.end_at)
    }
}

const workdayApi = {
    all,
    add,
    remove
}

export default workdayApi