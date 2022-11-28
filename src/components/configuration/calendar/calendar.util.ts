import { WorkdayConfiguration, WorkweekConfiguration } from "../../../interface/common.interface"
import { dateToDayOfWeek, addTimeStringToDate, dateToDateString, dateToTimeString } from "../../../services/util"

import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'

export function workweekConfigToEvent(date: Date, config: WorkweekConfiguration[]): Event | null {
    const configForDay = config.find(c => c.day === dateToDayOfWeek(date))
    if (!configForDay) {
        return null
    }

    return resourceToEvent(date, configForDay.startAt, configForDay.endAt, configForDay)
}

export function workdayConfigToEvent(workdayConfig: WorkdayConfiguration): Event {
    return resourceToEvent(workdayConfig.date, workdayConfig.startAt, workdayConfig.endAt, workdayConfig)
}

export function eventToWorkdayConfig(accountId: string, event: Event): WorkdayConfiguration {
    if (!event.start || !event.end) {
        throw new Error('Required: event.start and event.end')
    }

    return {
        accountId,
        date: event.start,
        startAt: dateToTimeString(event.start),
        endAt: dateToTimeString(event.end)
    }
}

function resourceToEvent(date: Date, startAt: string, endAt: string, resource: any): Event {
    const startDate = addTimeStringToDate(date, startAt)
    const endDate = addTimeStringToDate(date, endAt)

    // special handling for overnight workweek configurations
    // e.g. 22:00 - 06:00
    if (endDate.getHours() < startDate.getHours()) {
        endDate.setDate(date.getDate() + 1)
    }

    return {
        allDay: false,
        title: 'week',
        start: startDate,
        end: endDate,
        resource
    }
}