import React, { useEffect } from 'react'
import { Alert, AlertType, useAlerts } from '../../providers/alert.provider'

type AlertComponentProps = {
    alert: Alert
}

const AlertComponent = ({ alert }: AlertComponentProps) => {

    const DISMISS_ALERT_AFTER_MS = 3000

    const { removeAlert } = useAlerts()

    function alertTypeToClass(type: AlertType) {
        switch (type) {
            case AlertType.success:
                return 'alert-success'
            case AlertType.error:
                return 'alert-danger'
            case AlertType.warning:
                return 'alert-warning'
            case AlertType.info:
                return 'alert-infos'
            default:
                throw new Error('unhandled AlertType: ' + type)
        }
    }

    useEffect(() => {
        const removeTimeout = setTimeout(() => {
            removeAlert(alert)
        }, DISMISS_ALERT_AFTER_MS)

        return () => clearTimeout(removeTimeout)
    }, [alert])

    return (
        <div
            className={`alert ${alertTypeToClass(alert.type)} alert-dismissible fade show`}
            role="alert">
            {alert.message}
        </div>
    )
}

export default AlertComponent