import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit'
import React, { useEffect, useRef, useState } from 'react'
import { DayOfWeek, WorkweekConfiguration } from '../../interface/common.interface'
import { Alert, AlertType, useAlerts } from '../../providers/alert.provider'
import workweekConfigApi from '../../services/account/workweek-config.service'
import { compareArraysEqualShallow } from '../../util/arrays.util'
import WorkweekTableRow from './workweek-table/workweek-table-row.component'

type WorkweekTableProps = {
    accountId: string
}

const WorkweekTable = ({ accountId }: WorkweekTableProps) => {
    const [workweekData, setWorkweekData] = useState<WorkweekConfiguration[]>([])
    const [validationErrors, setValidationErrors] = useState(new Map())
    const [dataChanged, setDataChanged] = useState(false)
    const [performingUpdate, setPerformingUpdate] = useState(false)
    const originalWorkweekData = useRef<WorkweekConfiguration[]>([])

    const { addAlert } = useAlerts()

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

            // filter out rows where startAt and endAt equal ''
            const filteredWorkweekData = workweekData.filter(d => d.endAt.trim() && d.startAt.trim())
            console.log(`${filteredWorkweekData.length} of ${workweekData.length} valid to send`)

            await workweekConfigApi.addOrUpdate(accountId, filteredWorkweekData)

            addAlert(new Alert('Uspešno posodobljeno !', AlertType.success))

        } catch (error) {
            console.error('failed to update workweek', error)
            addAlert(new Alert('Napaka pri posodabljanju !', AlertType.error))
        } finally {
            setPerformingUpdate(false)
        }
    }

    async function fetchWorkweekData() {
        try {
            const response = await workweekConfigApi.get(accountId)

            addMissingDays(response)

            originalWorkweekData.current = response

            console.debug('workweek data', response)
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

    // The api doesn't return all days of the week.
    // add those for which there is no configuration yet
    function addMissingDays(workweek: WorkweekConfiguration[]) {
        const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        for (const day of daysOfWeek) {
            if (!workweek.some(wwc => wwc.day === day)) {
                const missingWorkweekConfig: WorkweekConfiguration = {
                    day: day as DayOfWeek,
                    startAt: '',
                    endAt: ''
                }
                workweek.splice(daysOfWeek.indexOf(day), 0, missingWorkweekConfig)
            }
        }
    }

    // either both values are defined or both are ''
    function validateWorkweekData() {
        const errors = new Map()

        console.debug(workweekData)
        const invalidConfigs = workweekData.filter(d =>
            (d.startAt.trim() && !d.endAt.trim()) ||
            (!d.startAt.trim() && d.endAt.trim()))

        console.debug('invalid configurations', invalidConfigs)

        for (const invalid of invalidConfigs) {
            errors.set(invalid.day, 'Vnesi začetek in konec')
        }

        setValidationErrors(errors)

        return errors.size === 0
    }

    return (
        <>
            <form onSubmit={ev => {
                ev.preventDefault()
                if (validateWorkweekData()) {
                    performWorkweekUpdate()
                }
            }}>
                <MDBTable responsive={true} borderless>
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
                            validationError={validationErrors.get(d.day)}
                            day={d.day} startAt={d.startAt} endAt={d.endAt}
                            updateAction={setTimeForDay} />))}
                    </MDBTableBody>
                </MDBTable>
                <MDBBtn
                    className='mb-2 d-block ms-auto'
                    type='submit'
                    disabled={!dataChanged || performingUpdate}>
                    <MDBSpinner className={!performingUpdate ? 'd-none' : ''} size='sm' role='status' tag='span' />
                    <span hidden={performingUpdate} >Shrani</span>
                </MDBBtn>
            </form>
        </>
    )
}

export default WorkweekTable
