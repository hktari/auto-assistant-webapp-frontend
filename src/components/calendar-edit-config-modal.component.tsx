import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBBtn, MDBModalBody, MDBModalFooter, MDBValidationItem, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { Event } from 'react-big-calendar'

type CalendarEditConfigModalProps = {
    event?: Event
    onSave: (updated: Event, original: Event) => void
}

const CalendarEditConfigModal = ({ event, onSave }: CalendarEditConfigModalProps) => {
    const [startAt, setStartAt] = useState<string>(event?.start?.toISOString() ?? '')
    const [endAt, setEndAt] = useState<string>(event?.end?.toISOString() ?? '')
    const [showModal, setShowModal] = useState(false);

    const toggleShow = () => setShowModal(!showModal);

    useEffect(() => {
        setShowModal(event ? true : false)
    }, [event])

    return (
        <MDBModal show={showModal} setShow={setShowModal} tabIndex='-1'>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Uredi Avtomatizacijo</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBValidationItem>
                            <MDBInput type={'datetime-local'} value={startAt}
                                onChange={e => setStartAt(e.currentTarget.value)
                                } />
                        </MDBValidationItem>
                        <MDBValidationItem>
                            <MDBInput type={'datetime-local'} value={endAt}
                                onChange={e => setEndAt(e.currentTarget.value)
                                } />
                        </MDBValidationItem>
                    </MDBModalBody>

                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleShow}>
                            Close
                        </MDBBtn>
                        <MDBBtn onClick={() => {
                            onSave({
                                ...event,
                                start: new Date(startAt),
                                end: new Date(endAt)
                            },event!)
                            toggleShow()
                        }}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}

export default CalendarEditConfigModal