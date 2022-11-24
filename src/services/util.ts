
export function dateToDayOfWeek(date: Date) {
    // start with sunday
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    return daysOfWeek[date.getUTCDay()]
}

/**
 * 
 * @param date the date
 * @param time time in the format: HH:mm
 */
export function timeAtToDate(date: Date, time: string) {
    const [hours, min] = time.split(':')
    const dateAtTime = new Date(date)
    dateAtTime.setUTCHours(Number(hours))
    dateAtTime.setUTCMinutes(Number(min))
    return dateAtTime
}


/**
 * Converts the given time string in local time to UTC in the format HH:mm
 * @param time format: HH:mm
 */
 export function timeStringToUTC(time: string) {
    const [hr, min] = time.split(':')
    const now = new Date()
    now.setHours(Number(hr))
    now.setMinutes(Number(min))

    return `${now.getUTCHours()}:${now.getUTCMinutes()}`
}