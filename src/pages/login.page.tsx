import { MDBContainer, MDBInputGroup, MDBBtn, MDBValidationItem, MDBValidation, MDBInput } from 'mdb-react-ui-kit'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth.provider'
import { ApiError } from '../services/http'

type LoginPageProps = {}

const LoginPage = (props: LoginPageProps) => {
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    });
    const [hidePassword, setHidePassword] = useState(true)

    const [validationErrors, setValidationErrors] = useState(new Map())
    const formRef = useRef<HTMLFormElement>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const onChange = (e: any) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
        setErrorMessage('')
    };

    function performValidation() {
        const errors = new Map()
        if (!formRef.current?.checkValidity()) {
            const emailRef = formRef.current?.querySelector<HTMLInputElement>('#emailInput')
            if (emailRef?.validity.typeMismatch) {
                errors.set('email', 'Prosim vnesite pravilen email.')
            }
        }
        setValidationErrors(errors)

        return errors.size === 0
    }
    async function performLogin() {
        if (!performValidation()) {
            return
        }

        console.log('logging in...')

        try {
            await login(formValue.email, formValue.password)
            navigate('/dashboard')
        } catch (error: any) {
            console.error('failed to login', error)
            if (error?.status === 400) {
                setErrorMessage('Napačen email ali geslo')
            } else {
                setErrorMessage('Neznana napaka. Prosim poskusite ponovno.')
            }

            // add :invalid to input elements
            formRef.current?.querySelectorAll('input').forEach(el => {
                el.setCustomValidity('error')
                el.checkValidity()
            })
        }

    }

    return (
        <MDBContainer>
            <h2 className='text-center mb-4'>Vpis</h2>
            <MDBValidation noValidate={true} ref={formRef}
                className={`row g-3`}
                onSubmit={ev => performLogin()}>
                <MDBValidationItem invalid={validationErrors.has('email')}
                    feedback={validationErrors.get('email')}
                    className='col-12'>
                    <MDBInput
                        value={formValue.email}
                        name='email'
                        type='email'
                        onChange={onChange}
                        id='emailInput'
                        onInput={ev => performValidation()}
                        required
                        label='Email'
                    />
                </MDBValidationItem>
                <div
                    className='col-12 input-group'>
                    <div className="flex-grow-1">
                        <MDBInput
                            value={formValue.password}
                            name='password'
                            type={`${hidePassword ? 'password' : 'text'}`}
                            onChange={onChange}
                            onInput={ev => performValidation()}
                            id='passwordInput'
                            required
                            label='Geslo'
                        />
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setHidePassword(!hidePassword)}
                        type="button">
                        <div className="color-primary fs-6">
                            <i hidden={!hidePassword} className="far fa-eye"></i>
                            <i hidden={hidePassword} className="far fa-eye-slash"></i>
                        </div>
                    </button>


                </div>
                <div className="text-danger">
                    {errorMessage}
                </div>
                <div className='col-12'>
                    <MDBBtn type='submit' block={true}>Vpiši me</MDBBtn>
                </div>
            </MDBValidation>
        </MDBContainer>
    );
}

export default LoginPage