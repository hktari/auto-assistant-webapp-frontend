import { MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit'
import React from 'react'

type LoginPageProps = {}

const LoginPage = (props: LoginPageProps) => {
    function performLogin(){
        console.log('logging in...')
      }
    
    return (
        <MDBContainer fluid>
            <MDBInputGroup className='mb-3' >
                <input className='form-control' type='email' placeholder="Email" />
            </MDBInputGroup>

            <MDBInputGroup className='mb-3' >
                <input className='form-control' type='password' placeholder="Password" />
            </MDBInputGroup>

            <MDBBtn onClick={performLogin}>Login</MDBBtn>
        </MDBContainer>
    )
}

export default LoginPage