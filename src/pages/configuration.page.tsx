import { MDBBtn, MDBContainer } from 'mdb-react-ui-kit'
import React from 'react'
import { Link } from 'react-router-dom'

type ConfigurationPageProps = {}

const ConfigurationPage = (props: ConfigurationPageProps) => {
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
                render mon-sun
                <br></br>
                insert start-end times
            </section>

            <section className="my-4" data-section="exceptions-config">
                <h3>Izjeme</h3>
                render month
                <br />
                on day of month click, either add daily config or add weekly exception
            </section>
        </MDBContainer>
    )
}

export default ConfigurationPage