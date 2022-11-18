import React, { useState } from 'react'
import { MDBInput } from 'mdb-react-ui-kit'

type WorkweekTableRowProps = {
    title: string
    startAt: string
    endAt: string
}

const WorkweekTableRow = ({ title, startAt, endAt }: WorkweekTableRowProps) => {
    const [startAtTime, setStartAtTime] = useState(startAt)
    const [endAtTime, setEndAtTime] = useState(endAt)

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
            <th scope='row'>{daysOfWeekMap.get(title)}</th>
            <td>
                <MDBInput type='time' value={startAtTime} onChange={e => setStartAtTime(e.currentTarget.value)}>
                </MDBInput>
            </td>
            <td>
                <MDBInput type='time' value={endAtTime} onChange={e => setEndAtTime(e.currentTarget.value)}>
                </MDBInput>
            </td>
        </tr>
    )
}

export default WorkweekTableRow