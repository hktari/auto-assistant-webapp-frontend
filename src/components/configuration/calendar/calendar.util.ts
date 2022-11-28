import { WorkdayConfiguration, WorkweekConfiguration, WorkweekException } from "../../../interface/common.interface"
import { dateToDayOfWeek, addTimeStringToDate, dateToDateString, dateToTimeString } from "../../../services/util"

import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'

export function workweekConfigToEvent(date: Date, config: WorkweekConfiguration[]): Event | null {
    const configForDay = config.find(c => c.day === dateToDayOfWeek(date))
    if (!configForDay) {
        return null
    }

    return resourceToEvent(date, configForDay.startAt, configForDay.endAt,
        { type: EventType.weeklyConfig, object: configForDay })
}
export function eventToWorkweekConfig(event: Event): WorkweekConfiguration {
    if (!event.resource?.object) {
        throw new Error('Required: event.resource.object. The event object was propably not created via workweekConfigToEvent()')
    }
    return event.resource.object as WorkweekConfiguration
}

export function workdayConfigToEvent(workdayConfig: WorkdayConfiguration): Event {
    return resourceToEvent(workdayConfig.date, workdayConfig.startAt, workdayConfig.endAt,
        { id: workdayConfig.id, type: EventType.dailyConfig, object: workdayConfig })
}

export function eventToWorkdayConfig(accountId: string, event: Event): WorkdayConfiguration {
    if (!event.start || !event.end) {
        throw new Error('Required: event.start and event.end')
    }

    return {
        accountId,
        id: event.resource?.id,
        date: event.start,
        startAt: dateToTimeString(event.start),
        endAt: dateToTimeString(event.end)
    }
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