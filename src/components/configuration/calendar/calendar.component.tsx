import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import { useAuth } from '../../../providers/auth.provider'
import workweekConfigApi from '../../../services/account/workweek-config.service'
import workdayApi from '../../../services/account/workday.service'
import { dateToDayOfWeek, addTimeStringToDate as addTimeStringToDate } from '../../../services/util'
import { WorkweekConfiguration } from '../../../interface/common.interface'
import CalendarEditConfigModal from '../../calendar-edit-config-modal.component'
import { eventToWorkdayConfig, workdayConfigToEvent, workweekConfigToEvent } from './calendar.util'
import { Alert, AlertType, useAlerts } from '../../../providers/alert.provider'

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
    const { addAlert } = useAlerts()

    useEffect(() => {
        fetchEvents()
    }, [user])

    const handleSelectSlot = useCallback(
        ({ start, end }: SlotInfo) => {
            setEditEvent({ start, end })
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

    const localizer = momentLocalizer(moment)

    const [editEvent, setEditEvent] = useState<Event | undefined>()

    async function onSaveEvent(updated: Event, original?: Event) {
        console.debug('saving event', updated)

        try {
            const newWorkday = await workdayApi.addOrUpdate(eventToWorkdayConfig(user?.id!, updated))
            const newEvent = workdayConfigToEvent(newWorkday)

            const eventsUpdate = [...events]
            if (original) {
                eventsUpdate.splice(eventsUpdate.indexOf(original), 1, newEvent)
            } else {
                eventsUpdate.push(newEvent)
            }

            setEvents(eventsUpdate)
            addAlert(new Alert('Uspešno posodobljeno', AlertType.success))
        } catch (error) {
            console.error(error)
            addAlert(new Alert('Napaka pri dodajanju', AlertType.error))
        }
    }

    async function onRemoveEvent(eventToRemove: Event) {
        console.debug('event', 'remove')

        try {
            await workdayApi.remove(eventToWorkdayConfig(user?.id!, eventToRemove))

            const eventsUpdate = [...events]
            eventsUpdate.splice(eventsUpdate.indexOf(eventToRemove), 1)
            setEvents(eventsUpdate)
            
            addAlert(new Alert('Uspešno izbrisano', AlertType.success))
        } catch (error) {
            console.error(error)
            addAlert(new Alert('Napaka pri brisanju', AlertType.error))
        }
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
            <CalendarEditConfigModal event={editEvent} onSave={onSaveEvent} onRemove={onRemoveEvent} />
        </div>
    )
}

export default CalendarConfig