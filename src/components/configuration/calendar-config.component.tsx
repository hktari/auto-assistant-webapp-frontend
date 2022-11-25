import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import { useAuth } from '../../providers/auth.provider'
import workweekConfigApi from '../../services/account/workweek-config.service'
import workdayApi from '../../services/account/workday.service'
import { dateToDayOfWeek, addTimeStringToDate as addTimeStringToDate } from '../../services/util'
import { WorkweekConfiguration } from '../../interface/common.interface'
import CalendarEditConfigModal from '../calendar-edit-config-modal.component'

type CalendarConfigProps = {
}

const CalendarConfig = (props: CalendarConfigProps) => {
    const [events, setEvents] = useState<Event[]>([
        {
            title: 'Learn cool stuff',
            start: new Date(),
            end: new Date(Date.now() + 1000 * 60 * 60),
        },
    ])

    const { user } = useAuth()

    useEffect(() => {
        fetchEvents()
    }, [user])

    const handleSelectSlot = useCallback(
        ({ start, end }: SlotInfo) => {
            const title = window.prompt('New Event name')
            if (title) {
                setEvents((prev) => [...prev, { start, end, title }])
            }
        },
        [setEvents]
    )

    const handleSelectEvent = useCallback(
        (event: Event) => {
            setEditEvent(event)
        },
        []
    )

    async function fetchEvents() {
        const events: Event[] = []

        console.debug('fetching workweek...')
        const workweekConfig = await workweekConfigApi.get(user?.id!)
        console.debug('fetching workweek exceptions...')
        const workweekExceptions = await workweekConfigApi.getExceptions(user?.id!)
        console.debug('fetching workday configs...')
        const dailyConfigs = await workdayApi.all(user?.id!)

        // create events based on workweek for the next three months
        const targetDate = new Date()
        targetDate.setMonth(targetDate.getMonth() + 3)

        let curDate = new Date()
        while (curDate < targetDate) {

            const event = workweekConfigToEvent(curDate, workweekConfig)
            if (event) {
                events.push(event)
            }
            curDate.setDate(curDate.getDate() + 1)
        }



        setEvents(events)
        console.debug('done !')

    }

    function workweekConfigToEvent(date: Date, config: WorkweekConfiguration[]): Event | null {
        const configForDay = config.find(c => c.day === dateToDayOfWeek(date))
        if (!configForDay) {
            return null
        }

        return {
            allDay: true,
            title: 'test',
            start: addTimeStringToDate(date, configForDay.startAt),
            end: addTimeStringToDate(date, configForDay.endAt),
            resource: configForDay
        }
    }

    const localizer = momentLocalizer(moment)

    const [editEvent, setEditEvent] = useState<Event | undefined>()

    function onSaveEvent(updated: Event, original: Event) {
        console.debug('saving event', updated)
    }

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
            />
            <CalendarEditConfigModal event={editEvent} onSave={onSaveEvent} />
        </div>
    )
}

export default CalendarConfig