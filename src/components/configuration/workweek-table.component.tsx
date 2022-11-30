import { MDBTable, MDBTableHead, MDBTableBody, MDBInput, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit'
import React, { useEffect, useRef, useState } from 'react'
import { DayOfWeek, WorkweekConfiguration } from '../../interface/common.interface'
import { Alert, AlertType, useAlerts } from '../../providers/alert.provider'
import { useAuth } from '../../providers/auth.provider'
import workweekConfigApi from '../../services/account/workweek-config.service'
import { compareArraysEqualShallow } from '../../util/arrays.util'
import WorkweekTableRow from './workweek-table/workweek-table-row.component'

type WorkweekTableProps = {
    accountId: string,
    workweekData: WorkweekConfiguration[]
    setWorkweekData: (workweekData: WorkweekConfiguration[]) => void
}

const WorkweekTable = ({ accountId, workweekData: originalWorkweekData, setWorkweekData: updateWorkweekData }: WorkweekTableProps) => {
    const [workweekData, setWorkweekData] = useState(originalWorkweekData)
    const [validationErrors, setValidationErrors] = useState(new Map())
    const [dataChanged, setDataChanged] = useState(false)
    const [performingUpdate, setPerformingUpdate] = useState(false)

    const { addAlert } = useAlerts()

    useEffect(() => {
        setWorkweekData(originalWorkweekData)
    }, [originalWorkweekData])
    
    // compare server data with client data 
    // set dataChanged flag
    useEffect(() => {
        const checkDataChangedTimeout = setTimeout(() => {
            setDataChanged(!compareArraysEqualShallow(workweekData, originalWorkweekData))
        }, 500)

        return () => {
            clearTimeout(checkDataChangedTimeout)
        }
    }, [workweekData])


    async function performWorkweekUpdate() {
        try {
            setPerformingUpdate(true)

            await workweekConfigApi.addOrUpdate(accountId, workweekData)

            setWorkweekData(workweekData)

            // notify parent
            updateWorkweekData(workweekData)
            addAlert(new Alert('Uspešno posodobljeno !', AlertType.success))

        } catch (error) {
            console.error('failed to update workweek', error)
            addAlert(new Alert('Napaka pri posodabljanju !', AlertType.error))
        } finally {
            setPerformingUpdate(false)
        }
    }

    function setTimeForDay(day: DayOfWeek, startAt: string, endAt: string) {
        console.log('setting' + ' day: ' + day + ' time to: ' + startAt + ' -> ' + endAt)

        const tmp = [...workweekData]

        const rowToUpdateIdx = workweekData.findIndex(d => d.day === day)
        if (rowToUpdateIdx === -1) {
            throw new Error('failed to find work week data row for ' + day)
        }

        const updatedRow = workweekData[rowToUpdateIdx].clone()
        updatedRow.startAt = startAt
        updatedRow.endAt = endAt

        tmp.splice(rowToUpdateIdx, 1, updatedRow)
        setWorkweekData(tmp)

    }

    // either both values are defined or both are ''
    function validateWorkweekData() {
        const errors = new Map()

        console.debug(workweekData)
        const invalidConfigs = workweekData.filter(wd => wd.isInvalid())
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
