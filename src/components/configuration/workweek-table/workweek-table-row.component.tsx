import React, { useState } from 'react'
import { MDBInput, MDBValidationItem } from 'mdb-react-ui-kit'
import { DayOfWeek } from '../../../interface/common.interface'

type WorkweekTableRowProps = {
    day: DayOfWeek
    startAt: string
    endAt: string
    validationError: string | undefined
    updateAction: (day: DayOfWeek, startAt: string, endAt: string) => void
}

const WorkweekTableRow = ({ day, startAt, endAt, validationError, updateAction }: WorkweekTableRowProps) => {
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
                <MDBValidationItem invalid={!!validationError} feedback={validationError}>
                    <MDBInput
                        className={validationError ? 'is-invalid' : ''}
                        type='time'
                        value={startAt}
                        onChange={e => {
                            updateAction(day, e.currentTarget.value, endAt)
                        }}>
                    </MDBInput>
                </MDBValidationItem>
            </td>
            <td>
                <MDBValidationItem invalid={!!validationError} feedback={validationError}>
                    <MDBInput
                        className={validationError ? 'is-invalid' : ''}
                        type='time'
                        value={endAt}
                        onChange={e => updateAction(day, startAt, e.currentTarget.value)}>
                    </MDBInput>
                </MDBValidationItem>
            </td>
        </tr>
    )
}

export default WorkweekTableRow