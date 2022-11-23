import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBBtn, MDBModalBody, MDBModalFooter, MDBValidationItem, MDBInput } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { Event } from 'react-big-calendar'

export interface EditEventRequest {
    startAt: Date
    endAt: Date
    event: Event
}

type CalendarEditConfigModalProps = {
    requestData?: EditEventRequest
    onSave: (startAt: Date, endAt: Date, event: Event) => void
}

const CalendarEditConfigModal = ({ requestData, onSave }: CalendarEditConfigModalProps) => {
    const [startAt, setStartAt] = useState<string>(requestData?.startAt.toISOString() ?? '')
    const [endAt, setEndAt] = useState<string>(requestData?.endAt.toISOString() ?? '')
    const [showModal, setShowModal] = useState(false);

    const toggleShow = () => setShowModal(!showModal);

    useEffect(() => {
        setShowModal(requestData ? true : false)
    }, [requestData])

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
                            onSave(new Date(startAt), new Date(endAt), requestData?.event!)
                            toggleShow()
                        }}>Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    )
}

export default CalendarEditConfigModal