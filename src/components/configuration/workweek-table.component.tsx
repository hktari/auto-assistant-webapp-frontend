import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit'
import React, { useEffect, useRef, useState } from 'react'
import { DayOfWeek, WorkweekConfiguration } from '../../interface/common.interface'
import workweekConfigApi from '../../services/account/workweek-config.service'
import { compareArraysEqualShallow } from '../../util/arrays.util'
import WorkweekTableRow from './workweek-table/workweek-table-row.component'

type WorkweekTableProps = {
    accountId: string
}

const WorkweekTable = ({ accountId }: WorkweekTableProps) => {
    const [workweekData, setWorkweekData] = useState<WorkweekConfiguration[]>([])
    const [dataChanged, setDataChanged] = useState(false)
    const [performingUpdate, setPerformingUpdate] = useState(false)
    const originalWorkweekData = useRef<WorkweekConfiguration[]>([])


    // init
    useEffect(() => {
        fetchWorkweekData()
    }, [accountId])

    // compare server data with client data 
    // set dataChanged flag
    useEffect(() => {
        const checkDataChangedTimeout = setTimeout(() => {
            setDataChanged(!compareArraysEqualShallow(workweekData, originalWorkweekData.current))
        }, 500)

        return () => {
            clearTimeout(checkDataChangedTimeout)
        }
    }, [workweekData])


    async function performWorkweekUpdate() {
        try {
            setPerformingUpdate(true)
            await workweekConfigApi.addOrUpdate(accountId, workweekData)
        } catch (error) {
            console.error('failed to update workweek', error)
        } finally {
            setPerformingUpdate(false)
        }
    }

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
        <>
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
            <MDBBtn className='mb-2 d-block ms-auto' onClick={() => performWorkweekUpdate()} disabled={!dataChanged || performingUpdate}>
                <MDBSpinner className={!performingUpdate ? 'd-none' : ''} size='sm' role='status' tag='span' />
                <span hidden={performingUpdate} >Shrani</span>
            </MDBBtn>
        </>
    )
}

export default WorkweekTable