import { describe, it } from '@jest/globals'
import { timeStringToUTC } from './util'


describe('util.ts', () => {
    describe('timeStringToUTC', () => {
        it('should return time string in UTC', () => {
            const now = new Date()
            const result = `${now.getUTCHours()}:${now.getUTCMinutes()}`
            const time = `${now.getHours()}:${now.getMinutes()}`

            expect(timeStringToUTC(time)).toBe(result)
        })
    })
})