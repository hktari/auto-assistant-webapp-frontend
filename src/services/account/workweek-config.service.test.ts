
import http from '../http'
jest.mock('http')

import { WorkweekConfiguration } from '../../interface/common.interface'
import { mapWorkweekConfigToPayload } from './workweek-config.service'

describe('workweek-config.service', () => {
    test('mapWorkweekConfigToPayload to have correct format', () => {
        const sample: WorkweekConfiguration[] = [
            {
                day: 'fri',
                startAt: '12:00',
                endAt: '20:00'
            },
            {
                day: 'mon',
                startAt: '12:00',
                endAt: '20:00'
            }
        ]

        const expectedResult = {
            days: {
                fri: {
                    start_at: '12:00',
                    end_at: '20:00'
                },
                mon: {
                    start_at: '12:00',
                    end_at: '20:00'
                }
            }
        }

        expect(mapWorkweekConfigToPayload(sample)).toMatchObject(expectedResult)
    })
})