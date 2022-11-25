import React from 'react'
import { useAlerts } from '../../providers/alert.provider'
import './alert-container.component.css'
import AlertComponent from './alert.component'
type AlertContainerProps = {}

const AlertContainer = (props: AlertContainerProps) => {

    const { alerts } = useAlerts()

    return (
        <div className="c-alert-container">
            {alerts.map(a => (
                <AlertComponent alert={a} />
            ))}
        </div>
    )
}

export default AlertContainer