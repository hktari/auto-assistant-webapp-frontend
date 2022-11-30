import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import { useAuth } from '../../../providers/auth.provider'
import workweekConfigApi from '../../../services/account/workweek-config.service'
import workdayApi from '../../../services/account/workday.service'
import { dateToDayOfWeek, addTimeStringToDate as addTimeStringToDate } from '../../../services/util'
import { WorkweekConfiguration } from '../../../interface/common.interface'
import CalendarEditConfigModal from '../../calendar-edit-config-modal.component'
import { containsWorkweekException as existsWorkweekException, EventMetadata, eventToWorkdayConfig, EventType, getWorkweekConfigForEventOrFail, workdayConfigToEvent, getEventForWorkweekConfigAndDate } from './calendar.util'
import { Alert, AlertType, useAlerts } from '../../../providers/alert.provider'

type CalendarConfigProps = {
    workweekData: WorkweekConfiguration[]
}

const CalendarConfig = ({ workweekData }: CalendarConfigProps) => {
    const [events, setEvents] = useState<Event[]>([])
    const [editEvent, setEditEvent] = useState<Event | undefined>()
    const [addNewEvent, setAddNewEvent] = useState(false)
    const { user } = useAuth()
    const { addAlert } = useAlerts()
    const localizer = momentLocalizer(moment)

    useEffect(() => {
        updateCalendar()
    }, [user, workweekData])

    const handleSelectSlot = useCallback(
        ({ start, end }: SlotInfo) => {
            // handle the case when user doesn't select a time span
            // prevent UTC time from representing the day before the one selected 
            // set default values, the way the user will probably use the calendar
            if (start.getHours() === 0) {
                start.setHours(8)
                end.setTime(start.getTime())
                end.setHours(start.getHours() + 8)
            }

            setEditEvent({ start, end })
            setAddNewEvent(true)
        },
        [setEvents]
    )

    const handleSelectEvent = useCallback(
        (event: Event) => {
            setEditEvent(event)
            setAddNewEvent(false)
        },
        []
    )

    async function updateCalendar() {
        let events: Event[] = []

        console.debug('calendar', 'fetching workweek exceptions...')
        const workweekExceptions = await workweekConfigApi.getExceptions(user?.id!)
        console.debug('calendar', `got ${workweekExceptions.length}`)
        console.debug('calendar', workweekExceptions)

        console.debug('calendar', 'fetching workday configs...')
        const workdayConfigs = await workdayApi.all(user?.id!)
        console.debug('calendar', `got ${workdayConfigs.length}`)

        /* -------------------------------- workweek -------------------------------- */
        // create events based on workweek for the next three months
        const targetDate = new Date()
        targetDate.setMonth(targetDate.getMonth() + 3)

        let curDate = new Date()
        while (curDate < targetDate) {

            // an event is added if a weekly config exists and the curDate is not present inside workweekExceptions array
            const workweekEvent = getEventForWorkweekConfigAndDate(curDate, workweekData)
            if (workweekEvent && !existsWorkweekException(curDate, workweekExceptions)) {
                events.push(workweekEvent)
            }

            curDate.setDate(curDate.getDate() + 1)
        }

        /* -------------------------------- workdays -------------------------------- */
        const workdayEvents = workdayConfigs.map(workdayConfig => workdayConfigToEvent(workdayConfig))
        events = events.concat(workdayEvents)


        setEvents(events)
    }


    async function onSaveEvent(event: Event) {
        console.debug('saving event', event)

        if (!event.start) {
            throw new Error('Required: event.start')
        }

        try {
            const { type }: EventMetadata = event?.resource

            // editing a weekly config requires adding a workweek exception before adding a daily configuration
            if (type === EventType.weeklyConfig) {
                await workweekConfigApi.addExceptionForWorkweek(event.start, getWorkweekConfigForEventOrFail(event, workweekData))
            }


            const newWorkday = await workdayApi.addOrUpdate(eventToWorkdayConfig(user?.id!, event))
            const newEvent = workdayConfigToEvent(newWorkday)

            const eventsUpdate = [...events]

            // Remove the original event if necessary, before adding the new one
            const originalEventIdx = eventsUpdate.indexOf(event)
            if (originalEventIdx !== -1) {
                eventsUpdate.splice(originalEventIdx, 1)
            }

            eventsUpdate.push(newEvent)

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
            const { id, type } = eventToRemove.resource as EventMetadata
            if (type === EventType.dailyConfig) {
                await workdayApi.remove(eventToWorkdayConfig(user?.id!, eventToRemove))
            } else if (type === EventType.weeklyConfig) {
                await workweekConfigApi.addExceptionForWorkweek(eventToRemove.start!, getWorkweekConfigForEventOrFail(eventToRemove, workweekData))
            }

            const eventsUpdate = [...events]
            const eventIdx = eventsUpdate.indexOf(eventToRemove)
            if (eventIdx !== -1) {
                console.warn('Expected to find eventToRemove inside events list', eventToRemove, events)
                eventsUpdate.splice(eventIdx, 1)
            }

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
            <CalendarEditConfigModal 
            event={editEvent} editing={!addNewEvent}
            onSave={onSaveEvent} onRemove={onRemoveEvent} />
        </div>
    )
}

export default CalendarConfig