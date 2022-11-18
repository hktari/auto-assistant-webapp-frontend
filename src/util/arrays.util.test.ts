import { compareArraysEqualShallow } from "./arrays.util"

describe('compareArraysEqualShallow', () => {
    it('should return false for different value objects', () => {
        const firstArr = [
            {
                day: 'mon',
                startAt: '12:00',
                endAt: '20:00'
            },
            {
                day: 'tue',
                startAt: '12:00',
                endAt: '20:00'
            },
        ]

        const secondArr = [
            {
                day: 'mon',
                startAt: '12:05', //change
                endAt: '20:00'
            },
            {
                day: 'tue',
                startAt: '12:00',
                endAt: '20:00'
            },
        ]

        expect(compareArraysEqualShallow(firstArr, secondArr)).toBeFalsy()
    })

    it('should return true for same value objects', () => {
        const firstArr = [
            {
                day: 'mon',
                startAt: '12:00',
                endAt: '20:00'
            },
            {
                day: 'tue',
                startAt: '12:00',
                endAt: '20:00'
            },
        ]

        const secondArr = firstArr.map(el => {
            return {
                ...el
            }
        })

        expect(compareArraysEqualShallow(firstArr, secondArr)).toBeTruthy()
    })
})