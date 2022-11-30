import { MDBBtn, MDBContainer, MDBInput, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CalendarConfig from '../components/configuration/calendar/calendar.component'
import WorkweekTable from '../components/configuration/workweek-table.component'
import { WorkweekConfiguration } from '../interface/common.interface'
import { useAuth } from '../providers/auth.provider'
import workweekConfigApi from '../services/account/workweek-config.service'

type ConfigurationPageProps = {}

const ConfigurationPage = function (props: ConfigurationPageProps) {

    const { user } = useAuth()
    const [workweekData, setWorkweekData] = useState<WorkweekConfiguration[]>([])


    async function fetchWorkweekData() {
        try {
            const workweekData = await workweekConfigApi.get(user?.id!)
            setWorkweekData(workweekData)
        } catch (error) {
            console.error('failed to fetch workweek data', error)
        }
    }

    // init
    useEffect(() => {
        fetchWorkweekData()
    }, [user?.id])

    return (
        <MDBContainer>
            <h2 className='mb-4'>Nastavitve</h2>
            <section data-section="user-config" className="my-4">
                <h3>Uporabnik</h3>
                <Link to={'/credentials'}>
                    <MDBBtn>
                        Nastavi uporabnika
                    </MDBBtn>
                </Link>
            </section>

            <section className="my-4" data-section="week-config">
                <h3>Delovni teden</h3>
                <WorkweekTable accountId={user?.id!} workweekData={workweekData} setWorkweekData={setWorkweekData} />
            </section>

            <section className="my-4" data-section="exceptions-config">
                <h3>Koledar</h3>
                <CalendarConfig workweekData={workweekData} />
            </section>
        </MDBContainer>
    )
}

export default ConfigurationPage