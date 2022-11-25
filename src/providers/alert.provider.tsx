import { createContext, useContext, useState } from "react"

export enum AlertType {
    success,
    error,
    info,
    warning
}

export class Alert {
    private static idCntr: number = 0
    id: number
    message: string
    type: AlertType

    constructor(message: string, type: AlertType) {
        this.id = Alert.idCntr++
        this.message = message
        this.type = type
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
        setAlerts([...alerts, alert])
    }

    function removeAlert(alert: Alert) {
        const toRemoveIdx = alerts.findIndex(a => a.id === alert.id)
        if (toRemoveIdx === -1) {
            throw new Error('failed to remove alert')
        }

        const tmp = [...alerts]
        tmp.splice(toRemoveIdx, 1)
        setAlerts(tmp)
    }

    const value = { alerts, addAlert, removeAlert }
    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}


export function useAlerts() {
    return useContext(AlertContext)
}

export default AlertProvider