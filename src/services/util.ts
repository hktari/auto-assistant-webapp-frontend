
export function dateToDayOfWeek(date: Date) {
    // start with sunday
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    return daysOfWeek[date.getUTCDay()]
}

/**
 * 
 * @param date 
 * @returns string in format: YYY-MM-DD
 */
export function dateToDateString(date: Date): string {
    return date.toISOString().substring(0, 10)
}


/**
 * Adds the time given hours and minutes in a time string to the given Date object
 * @param date the date
 * @param time time in the format: HH:mm in localTime
 */
export function timeAtToDate(date: Date, time: string) {
    const [hours, min] = time.split(':')
    const dateAtTime = new Date(date)
    dateAtTime.setHours(Number(hours))
    dateAtTime.setMinutes(Number(min))
    return dateAtTime
}


/**
 * Converts the given time string in local time to UTC in the format HH:mm
 * @param time format: HH:mm
 */
export function localTimeStringToUTC(time: string) {
    const [hr, min] = time.split(':')
    const now = new Date()
    now.setHours(Number(hr))
    now.setMinutes(Number(min))

    return `${now.getUTCHours()}:${now.getUTCMinutes()}`
}

/**
 * Converts the given time string from UTC to local time
 * @param time format: HH:mm
 */
export function timeStringToLocalTime(time: string) {
    const [hr, min] = time.split(':')
    const now = new Date()
    now.setUTCHours(Number(hr))
    now.setUTCMinutes(Number(min))

    return `${now.getHours()}:${now.getMinutes()}`
}