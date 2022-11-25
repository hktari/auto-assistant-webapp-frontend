import React, { useEffect } from 'react'
import { useAlerts } from '../../providers/alert.provider'
import './alert-container.component.css'
import AlertComponent from './alert.component'
type AlertContainerProps = {}

const AlertContainer = (props: AlertContainerProps) => {

    const { alerts, removeAlert } = useAlerts()

    useEffect(() => {
        const dismissTimeouts = alerts.map(a => setTimeout(() => {
            console.debug('alert', 'dismiss now')
            removeAlert(a)
        }, Math.max(0, a.dismissAt.getTime() - Date.now())))

        return () => dismissTimeouts.forEach(dt => clearTimeout(dt))
    }, [alerts])

    return (
        <div className="c-alert-container">
            {alerts.map(a => (
                <AlertComponent alert={a} />
            ))}
        </div>
    )
}

export default AlertContainer