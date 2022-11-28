import { addTimeStringToDate, utcTimeStringToLocalTime } from "../services/util"

export interface JWT {
    token: string
}


export interface User {
    id: string
    email: string
    automationEnabled: boolean
}

export interface Credentials {
    id: string,
    email: string,
    username: string,
    password_cipher: string,
    iv_cipher: string
}


export interface LogEntry {
    id: string;
    status: string;
    timestamp: Date;
    error: null;
    message: string;
    action: string;
    config_type: string;
}



export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export class WorkweekConfiguration {
    accountId: string

    day: DayOfWeek

    // format: hh:mm
    startAt: string

    // format: hh:mm
    endAt: string

    /**
     *
     */
    constructor(accountId: string, day: string, startAt: string, endAt: string) {
        this.accountId = accountId
        this.day = day as DayOfWeek
        this.startAt = utcTimeStringToLocalTime(startAt)
        this.endAt = utcTimeStringToLocalTime(endAt)
    }

    getStartDatetime(date: Date) {
        return addTimeStringToDate(date, this.startAt)
    }

    getEndDatetime(date: Date) {
        const startDate = addTimeStringToDate(date, this.startAt)
        const endDate = addTimeStringToDate(date, this.endAt)

        // special handling for when endAt < startAt
        // e.g. 22:00 - 06:00
        if (endDate.getTime() < startDate.getTime()) {
            const dayAfter = new Date(date)
            dayAfter.setDate(date.getDate() + 1)

            return addTimeStringToDate(dayAfter, this.endAt)
        } else {
            return endDate
        }
    }
}

export interface WorkdayConfiguration {
    id?: string
    day?: string
    loginInfoId?: string,
    accountId: string,

    // format: YYY-MM-DD
    date: Date,

    // format: hh:mm
    startAt: string,

    // format: hh:mm
    endAt: string
}

export enum AutomationAction {
    StartBtn = 'start_btn',
    StopBtn = 'stop_btn'

}

export interface WorkweekException {
    id: string
    accountId: string
    date: Date
    action: AutomationAction
}