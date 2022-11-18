import { MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { WorkweekConfiguration } from '../../interface/common.interface'
import workweekConfigApi from '../../services/account/workweek-config.service'
import WorkweekTableRow from './workweek-table/workweek-table-row.component'

type WorkweekTableProps = {
    accountId: string
}

const WorkweekTable = ({ accountId }: WorkweekTableProps) => {
    const [workweekData, setWorkweekData] = useState<WorkweekConfiguration[]>([])

    useEffect(() => {
        fetchWorkweekData()
    }, [accountId])


    async function fetchWorkweekData() {
        try {
            setWorkweekData(await workweekConfigApi.get(accountId))
        } catch (error) {
            console.error('failed to fetch workweek data', error)
        }
    }

    function setTimeForDay(startAt: string, endAt: string) {
        console.log('setting time to: ' + startAt + ' -> ' + endAt)
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
                    title={d.day} startAt={d.startAt} endAt={d.endAt} />))}
            </MDBTableBody>
        </MDBTable>
    )
}

export default WorkweekTable