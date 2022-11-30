import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer, Event, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import { useAuth } from '../../../providers/auth.provider'
import workweekConfigApi from '../../../services/account/workweek-config.service'
import workdayApi from '../../../services/account/workday.service'
import { dateToDayOfWeek, addTimeStringToDate as addTimeStringToDate } from '../../../services/util'
import { WorkweekConfiguration } from '../../../interface/common.interface'
import CalendarEditConfigModal from '../../calendar-edit-config-modal.component'
import { containsWorkweekException as existsWorkweekException, EventMetadata, eventToWorkdayConfig, EventType, getWorkweekConfigForEvent, getWorkweekConfigForEventOrFail, workdayConfigToEvent, workweekConfigToEvent } from './calendar.util'
import { Alert, AlertType, useAlerts } from '../../../providers/alert.provider'

type CalendarConfigProps = {
    workweekConfigList: WorkweekConfiguration[]
}

const CalendarConfig = ({ workweekConfigList }: CalendarConfigProps) => {
    const [events, setEvents] = useState<Event[]>([])

    const { user } = useAuth()
    const { addAlert } = useAlerts()

    useEffect(() => {
        fetchEvents()
    }, [user, workweekConfigList])

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
            const workweekEvent = workweekConfigToEvent(curDate, workweekConfigList)
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

    const localizer = momentLocalizer(moment)

    const [editEvent, setEditEvent] = useState<Event | undefined>()

    async function onSaveEvent(event: Event) {
        console.debug('saving event', event)

        if (!event.start) {
            throw new Error('Required: event.start')
        }

        try {
            const { type }: EventMetadata = event?.resource

            // editing a weekly config requires adding a workweek exception before adding a daily configuration
            if (type === EventType.weeklyConfig) {
                await workweekConfigApi.addExceptionForWorkweek(event.start, getWorkweekConfigForEventOrFail(event, workweekConfigList))
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
                await workweekConfigApi.addExceptionForWorkweek(eventToRemove.start!, getWorkweekConfigForEventOrFail(eventToRemove, workweekConfigList))
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
            <CalendarEditConfigModal event={editEvent} onSave={onSaveEvent} onRemove={onRemoveEvent} />
        </div>
    )
}

export default CalendarConfig