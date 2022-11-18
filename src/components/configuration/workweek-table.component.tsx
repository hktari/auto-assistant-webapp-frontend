import { MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useRef, useState } from 'react'
import { DayOfWeek, WorkweekConfiguration } from '../../interface/common.interface'
import workweekConfigApi from '../../services/account/workweek-config.service'
import WorkweekTableRow from './workweek-table/workweek-table-row.component'

type WorkweekTableProps = {
    accountId: string
}

const WorkweekTable = ({ accountId }: WorkweekTableProps) => {
    const [workweekData, setWorkweekData] = useState<WorkweekConfiguration[]>([])
    const [dataChanged, setDataChanged] = useState(false)
    const originalWorkweekData = useRef<WorkweekConfiguration[]>([])


    // init
    useEffect(() => {
        fetchWorkweekData()
    }, [accountId])

    useEffect(() => {
        console.log('updating workweek data')
        console.log(workweekData)
    }, [workweekData])


    async function fetchWorkweekData() {
        try {
            const response = await workweekConfigApi.get(accountId)
            originalWorkweekData.current = response
            setWorkweekData(response)
        } catch (error) {
            console.error('failed to fetch workweek data', error)
        }
    }

    function setTimeForDay(day: DayOfWeek, startAt: string, endAt: string) {
        console.log('setting' + ' day: ' + day + ' time to: ' + startAt + ' -> ' + endAt)

        const tmp = [...workweekData]

        const rowToUpdateIdx = workweekData.findIndex(d => d.day === day)
        if (rowToUpdateIdx === -1) {
            throw new Error('failed to find work week data row for ' + day)
        }

        const updatedRow = {
            ...workweekData[rowToUpdateIdx],
            startAt,
            endAt
        }

        tmp.splice(rowToUpdateIdx, 1, updatedRow)
        setWorkweekData(tmp)

    }

    return (
        <MDBTable borderless>
            <MDBTableHead className='table-dark'>
                <tr>
                    <th scope='col'><span className='text-nowrap'>Dan v tednu</span></th>
                    <th scope='col'>Začetek</th>
                    <th scope='col'>Konec</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {workweekData.map((d, idx) =>
                (<WorkweekTableRow
                    key={`576c0255545645f78a40cfe6154e6e85${idx}`}
                    day={d.day} startAt={d.startAt} endAt={d.endAt}
                    updateAction={setTimeForDay} />))}
            </MDBTableBody>
        </MDBTable>
    )
}

export default WorkweekTable