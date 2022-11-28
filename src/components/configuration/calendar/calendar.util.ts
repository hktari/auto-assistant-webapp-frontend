import { WorkweekConfiguration } from "../../../interface/common.interface"
import { dateToDayOfWeek, addTimeStringToDate } from "../../../services/util"

import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'

export function workweekConfigToEvent(date: Date, config: WorkweekConfiguration[]): Event | null {
    const configForDay = config.find(c => c.day === dateToDayOfWeek(date))
    if (!configForDay) {
        return null
    }

    const startDate = addTimeStringToDate(date, configForDay.startAt)
    const endDate = addTimeStringToDate(date, configForDay.endAt)

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
        resource: configForDay
    }
}
