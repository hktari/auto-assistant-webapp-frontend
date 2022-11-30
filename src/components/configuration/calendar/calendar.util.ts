import { WorkdayConfiguration, WorkweekConfiguration, WorkweekException } from "../../../interface/common.interface"
import { dateToDayOfWeek, addTimeStringToDate, dateToDateString, dateToTimeString } from "../../../services/util"

import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'

/* --------------------------------- mapping -------------------------------- */
export function workweekConfigToEvent(date: Date, config: WorkweekConfiguration[]): Event | null {
    const configForDay = config.find(c => c.day === dateToDayOfWeek(date))
    if (!configForDay) {
        return null
    }

    return resourceToEvent(date, configForDay.startAt, configForDay.endAt,
        { type: EventType.weeklyConfig, object: configForDay })
}

export function workdayConfigToEvent(workdayConfig: WorkdayConfiguration): Event {
    return resourceToEvent(workdayConfig.date, workdayConfig.startAt, workdayConfig.endAt,
        { id: workdayConfig.id, type: EventType.dailyConfig, object: workdayConfig })
}

export function eventToWorkdayConfig(accountId: string, event: Event): WorkdayConfiguration {
    if (!event.start || !event.end) {
        throw new Error('Required: event.start and event.end')
    }

    const metadata = event.resource as EventMetadata

    return {
        accountId,
        id: metadata?.id,
        date: event.start,
        startAt: dateToTimeString(event.start),
        endAt: dateToTimeString(event.end)
    }
}

function resourceToEvent(date: Date, startAt: string, endAt: string, metadata: EventMetadata): Event {
    const startDate = addTimeStringToDate(date, startAt)
    const endDate = addTimeStringToDate(date, endAt)

    // special handling for overnight workweek configurations
    // e.g. 22:00 - 06:00
    if (endDate.getHours() < startDate.getHours()) {
        endDate.setDate(date.getDate() + 1)
    }

    return {
        allDay: false,
        title: metadata.type === EventType.weeklyConfig ? 'week' : 'daily',
        start: startDate,
        end: endDate,
        resource: metadata
    }
}

/**
 * Checks whether the given date is present in the exceptions array
 */
export function containsWorkweekException(date: Date, exceptions: WorkweekException[]): boolean {
    return exceptions.some(ex => ex.date.toISOString().substring(0, 10) === date.toISOString().substring(0, 10))
}

export function getWorkweekConfigForEventOrFail(event: Event, workweekConfigList: WorkweekConfiguration[]): WorkweekConfiguration {
    if (!event.start) {
        throw new Error('Required: event.start')
    }

    const eventDayOfWeek = dateToDayOfWeek(event.start)
    const workweekConfig = workweekConfigList.find(wwc => wwc.day === eventDayOfWeek)

    if (!workweekConfig) {
        throw new Error(`Failed to find WorkweekConfiguration object for event. ${eventDayOfWeek} not found inside ${JSON.stringify(workweekConfigList)}`)
    }

    return workweekConfig
}


export enum EventType {
    unknown,
    dailyConfig,
    weeklyConfig,
}

export interface EventMetadata {
    id?: string,
    type: EventType,
    object: any
}
