import { MDBBtn, MDBContainer, MDBInput, MDBInputGroup, MDBSpinner } from 'mdb-react-ui-kit'
import React, { MouseEvent, MouseEventHandler, useEffect, useState } from 'react'
import { useAuth } from '../providers/auth.provider'
import credentialsService from '../services/account/credentials.service'

type CredentialsPageProps = {}

const CredentialsPage = (props: CredentialsPageProps) => {

    const { user } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [updatingCredentials, setUpdatingCredentials] = useState(false)
    const [existingCredentials, setExistingCredentials] = useState<{ username: string } | null>(null)

    useEffect(() => {
        fetchCredentials()
    }, [user])


    async function fetchCredentials() {
        try {
            console.log('fetching credentials...')
            const { username } = await credentialsService.getCredentials(user?.id!)
            setUsername(username)
            setExistingCredentials({ username })
        } catch (error) {
            console.error('failed to fetch credentials', error)
            setUsername('')
            setPassword('')
            setExistingCredentials(null)
        }
    }

    async function performAddCredentials() {
        const formattedUsername = username?.trim()
        if (!formattedUsername || !password) {
            return
        }

        try {
            setUpdatingCredentials(true)
            console.log('adding credentials...')
            await credentialsService.addCredentials(user?.id!, username, password)
            setExistingCredentials({ username })
            console.log('done')
        } catch (error) {
            console.error('failed to save credentials', error)
        } finally {
            setUpdatingCredentials(false)
        }
    }

    async function performDeleteCredentials() {
        try {
            setUpdatingCredentials(true)
            console.log('deleting credentials...')
            await credentialsService.deleteCredentials(user?.id!)
            setExistingCredentials(null)
            console.log('done')
        } catch (error) {
            console.error('error deleting credentials', error)
        } finally {
            setUpdatingCredentials(false)
        }
    }

    return (
        <MDBContainer>
            <h2>Nastavitev uporabnika MDDSZ</h2>

            <div className="py-2">
                {existingCredentials !== null ?
                    (
                        <form>
                            <MDBInput
                                required
                                disabled={true}
                                className='mb-3' label='Uporabniško ime' id='username' type='text'
                                value={username} />
                            <MDBInput
                                required
                                disabled={true}
                                className='mb-3' label='Geslo' id='password' type='password'
                                value='secret' />
                            <MDBBtn
                                color='danger'
                                block={true}
                                disabled={updatingCredentials}
                                onClick={ev => {
                                    ev.preventDefault()
                                    performDeleteCredentials()
                                }}
                            >
                                <MDBSpinner className={!updatingCredentials ? 'd-none' : ''} size='sm' role='status' tag='span' />
                                <span hidden={updatingCredentials}>Izbriši</span>
                            </MDBBtn>
                        </form>
                    )
                    :
                    (
                        <form onSubmit={ev => {
                            ev.preventDefault()
                            performAddCredentials()
                        }}>
                            <MDBInput
                                required
                                className='mb-3' label='Uporabniško ime' id='typeEmail' type='text'
                                value={username} onChange={e => setUsername(e.currentTarget.value)} />
                            <MDBInput
                                required
                                className='mb-3' label='Geslo' id='typePassword' type='password'
                                value={password} onChange={e => setPassword(e.currentTarget.value)} />
                            <MDBBtn
                                block={true}
                                color='primary'
                                disabled={updatingCredentials}
                                type='submit'>
                                <MDBSpinner className={!updatingCredentials ? 'd-none me-2' : 'me-2'} size='sm' role='status' tag='span' />
                                <span hidden={!updatingCredentials}>Dodajam...</span>
                                <span hidden={updatingCredentials}>Dodaj</span>
                            </MDBBtn>
                        </form>

                    )
                }
            </div>
        </MDBContainer>
    )
}

export default CredentialsPage