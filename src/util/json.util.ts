export function ParseDatesReviver(key: string, value: string) {
    const dateKeyRx = /time|created|date/i
    if (dateKeyRx.test(key)) {
        try {
            return new Date(value)
        } catch (error) {
            console.error('Failed to parse date', error)
        }
    } else {
        return value
    }
}