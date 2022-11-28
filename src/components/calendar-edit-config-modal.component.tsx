import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBBtn, MDBModalBody, MDBModalFooter, MDBValidationItem, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { Event } from 'react-big-calendar'

type CalendarEditConfigModalProps = {
    event?: Event
    onSave: (updated: Event, original: Event) => void
}

const CalendarEditConfigModal = ({ event, onSave }: CalendarEditConfigModalProps) => {
    const [startAtDate, setStartAtDate] = useState<string>(new Date().toISOString().substring(0, 10))
    const [startAtTime, setStartAtTime] = useState<string>('')
    const [endAtDate, setEndAtDate] = useState<string>(new Date().toISOString().substring(0, 10))
    const [endAtTime, setEndAtTime] = useState<string>('')
    const [showModal, setShowModal] = useState(false);

    const toggleShow = () => setShowModal(!showModal);

    useEffect(() => {
        if (event) {
            setShowModal(true)

            // iso format is: YYYY-MM-DDTHH:mm
            setStartAtDate(event.start?.toISOString()?.substring(0, 10)!)
            setEndAtDate(event.end?.toISOString()?.substring(0, 10)!)
            setStartAtTime(event.start?.toTimeString()?.substring(0, 5)!)
            setEndAtTime(event.end?.toTimeString()?.substring(0, 5)!)
        }
        else {
            setShowModal(false)
        }
    }, [event])


    /**
     * 
     * @param date YYYY-MM-DD
     * @param time HH:mm
     */
    function joinToDate(date: string, time: string) {
        return new Date(`${date}T${time}`)
    }

    return (
        <MDBModal show={showModal} setShow={setShowModal} tabIndex='-1'>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Uredi Avtomatizacijo</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <div className="row mb-2">
                            <div className="form-label">
                                Začetek
                            </div>
                            <MDBValidationItem className='col-6'>
                                <MDBInput
                                    required
                                    type={'date'}
                                    value={startAtDate}
                                    onChange={e => setStartAtDate(e.currentTarget.value)}
                                />
                            </MDBValidationItem>
                            <MDBValidationItem className='col-6'>
                                <MDBInput
                                    required
                                    placeholder=''
                                    type={'time'} value={startAtTime}
                                    onChange={e => setStartAtTime(e.currentTarget.value)
                                    } />
                            </MDBValidationItem>
                        </div>
                        <div className="row mb-2">
                            <div className="form-label">
                                Konec
                            </div>
                            <MDBValidationItem className='col-6'>
                                <MDBInput
                                    required
                                    type={'date'}
                                    value={endAtDate}
                                    onChange={e => setEndAtDate(e.currentTarget.value)}
                                />
                            </MDBValidationItem>
                            <MDBValidationItem className='col-6'>
                                <MDBInput
                                    required
                                    placeholder=''
                                    type={'time'} value={endAtTime}
                                    onChange={e => setEndAtTime(e.currentTarget.value)
                                    } />
                            </MDBValidationItem>
                        </div>
                    </MDBModalBody>

                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleShow}>
                            Close
                        </MDBBtn>
                        <MDBBtn onClick={() => {
                            onSave({
                                ...event,
                                start: joinToDate(startAtDate, startAtTime),
                                end: joinToDate(endAtDate, endAtTime)
                            }, event!)
                            toggleShow()
                        }}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}

export default CalendarEditConfigModal