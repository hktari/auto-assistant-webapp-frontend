import { MDBBtn, MDBContainer, MDBInput, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ExceptionConfigTable from '../components/configuration/exception-config-table.component'
import WorkweekTable from '../components/configuration/workweek-table.component'
import { useAuth } from '../providers/auth.provider'

type ConfigurationPageProps = {}

const ConfigurationPage = function (props: ConfigurationPageProps) {

    const { user } = useAuth()

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
                <WorkweekTable accountId={user?.id!} />
            </section>

            <section className="my-4" data-section="exceptions-config">
                <h3>Izjeme</h3>
                <ExceptionConfigTable />
                <br />
                on day of month click, either add daily config or add weekly exception
            </section>
        </MDBContainer>
    )
}

export default ConfigurationPage