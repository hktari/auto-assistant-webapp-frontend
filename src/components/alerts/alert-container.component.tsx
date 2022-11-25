import React from 'react'
import { useAlerts } from '../../providers/alert.provider'
import './alert-container.component.css'
type AlertContainerProps = {}

const AlertContainer = (props: AlertContainerProps) => {

    const { alerts } = useAlerts()

    return (
        <div className="c-alert-container">
            {alerts.map(a => (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {a.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            ))}
        </div>
    )
}

export default AlertContainer