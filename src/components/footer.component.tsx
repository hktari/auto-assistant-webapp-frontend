import { MDBFooter } from 'mdb-react-ui-kit'
import React from 'react'
import { useLocation } from 'react-router-dom'

type FooterProps = {}

const Footer = (props: FooterProps) => {
    return (
        <MDBFooter className='text-muted h-100'>
            <div className="d-flex align-items-center justify-content-center h-100">
            </div>
        </MDBFooter>
    )
}

export default Footer