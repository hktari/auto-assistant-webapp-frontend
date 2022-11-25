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

export interface WorkweekConfiguration {
    day: DayOfWeek

    // format: hh:mm
    startAt: string

    // format: hh:mm
    endAt: string
}

export interface WorkdayConfiguration {
    day?: string,
    loginInfoId?: string,

    // format: YYY-MM-DD
    date: string,

    // format: hh:mm
    startAt: string,

    // format: hh:mm
    endAt: string
}

export enum AutomationAction {
    StartBtn = 'start_btn',
    StopBtn = 'stop_btn'

}

export interface WorkweekException{
    id?: string
    date: Date
    action: AutomationAction
}