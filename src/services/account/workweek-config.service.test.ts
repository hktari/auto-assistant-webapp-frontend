
import http from '../http'
jest.mock('http')

import { WorkweekConfiguration } from '../../interface/common.interface'
import { mapWorkweekConfigToDto } from './workweek-config.service'

describe('workweek-config.service', () => {
    test('mapWorkweekConfigToPayload to have correct format', () => {
        const sample: WorkweekConfiguration[] = [
            new WorkweekConfiguration(
                '1',
                'fri',
                '12:00',
                '20:00'
            ),
            new WorkweekConfiguration(
                '1',
                'mon',
                '12:00',
                '20:00'
            )
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

        expect(mapWorkweekConfigToDto(sample)).toMatchObject(expectedResult)
    })
})