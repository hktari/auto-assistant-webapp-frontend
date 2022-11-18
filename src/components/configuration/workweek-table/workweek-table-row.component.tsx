import React, { useState } from 'react'
import { MDBInput } from 'mdb-react-ui-kit'
import { DayOfWeek } from '../../../interface/common.interface'

type WorkweekTableRowProps = {
    day: DayOfWeek
    startAt: string
    endAt: string
    updateAction: (day: DayOfWeek, startAt: string, endAt: string) => void
}

const WorkweekTableRow = ({ day, startAt, endAt, updateAction }: WorkweekTableRowProps) => {
    const daysOfWeekMap = new Map([
        ['mon', 'pon'],
        ['tue', 'tor'],
        ['wed', 'sre'],
        ['thu', 'čet'],
        ['fri', 'pet'],
        ['sat', 'sob'],
        ['sun', 'ned']
    ])



    return (
        <tr>
            <th scope='row'>{daysOfWeekMap.get(day)}</th>
            <td>
                <MDBInput
                    type='time'
                    value={startAt}
                    onChange={e => {
                        updateAction(day, e.currentTarget.value, endAt)
                    }}>
                </MDBInput>
            </td>
            <td>
                <MDBInput
                    type='time'
                    value={endAt}
                    onChange={e => updateAction(day, startAt, e.currentTarget.value)}>
                </MDBInput>
            </td>
        </tr>
    )
}

export default WorkweekTableRow