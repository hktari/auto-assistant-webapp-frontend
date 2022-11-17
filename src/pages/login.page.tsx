import { MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth.provider'

type LoginPageProps = {}

const LoginPage = (props: LoginPageProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    async function performLogin() {
        console.log('logging in...')

        try {
            await login(email, password)
            navigate('/dashboard')
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
                <input className='form-control' type='email' placeholder="Email"
                    value={email} onChange={e => setEmail(e.currentTarget.value)} />
            </MDBInputGroup>

            <MDBInputGroup className='mb-3' >
                <input className='form-control' type='password' placeholder="Password"
                    value={password} onChange={e => setPassword(e.currentTarget.value)} />
            </MDBInputGroup>

            <MDBBtn className='w-100' onClick={performLogin}>Login</MDBBtn>
        </MDBContainer>
    )
}

export default LoginPage