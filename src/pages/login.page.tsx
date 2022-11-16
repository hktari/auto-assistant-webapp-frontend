import { MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth.provider'

type LoginPageProps = {}

const LoginPage = (props: LoginPageProps) => {
    const { login } = useAuth()
    const navigate = useNavigate()

    async function performLogin() {
        console.log('logging in...')

        try {
            await login('bkamnik1995@gmail.com', 'Z5vnp28ialNRIBUex6Y')
            navigate('/dashboard')
            console.log('OK')
        } catch (error) {
            console.error('failed to login', error)
        }
    }

    return (
        <MDBContainer fluid className='py-5'>
            <div className="mb-3 text-center">
                <h2>Login</h2>
            </div>
            <MDBInputGroup className='mb-3' >
                <input className='form-control' type='email' placeholder="Email" />
            </MDBInputGroup>

            <MDBInputGroup className='mb-3' >
                <input className='form-control' type='password' placeholder="Password" />
            </MDBInputGroup>

            <MDBBtn className='w-100' onClick={performLogin}>Login</MDBBtn>
        </MDBContainer>
    )
}

export default LoginPage