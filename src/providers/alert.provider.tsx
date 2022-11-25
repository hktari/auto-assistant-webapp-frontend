import { createContext, useContext, useState } from "react"

export enum AlertType {
    success,
    error,
    info,
    warning
}

export class Alert {
    private static DISMISS_ALERT_AFTER_MS : number = 3000

    private static idCntr: number = 0
    id: number
    message: string
    type: AlertType
    dismissAt: Date

    constructor(message: string, type: AlertType) {
        this.id = Alert.idCntr++
        this.message = message
        this.type = type
        this.dismissAt = new Date(Date.now() + Alert.DISMISS_ALERT_AFTER_MS)
    }
}

interface AlertContext {
    alerts: Alert[]
    addAlert: (alert: Alert) => void
    removeAlert: (alert: Alert) => void
}

const AlertContext = createContext<AlertContext>({ alerts: [], addAlert: null!, removeAlert: null! })


const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([])

    function addAlert(alert: Alert) {
        const tmp = [...alerts, alert]
        console.debug('alert', 'add', tmp)
        setAlerts(tmp)
    }

    function removeAlert(alert: Alert) {
        console.debug('alert', 'remove start', alerts)

        const toRemoveIdx = alerts.findIndex(a => a.id === alert.id)
        if (toRemoveIdx === -1) {
            throw new Error('failed to remove alert')
        }

        const tmp = [...alerts]
        tmp.splice(toRemoveIdx, 1)
        console.debug('alert', 'remove end', tmp)

        setAlerts(tmp)
    }

    const value = { alerts, addAlert, removeAlert }
    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}


export function useAlerts() {
    return useContext(AlertContext)
}

export default AlertProvider