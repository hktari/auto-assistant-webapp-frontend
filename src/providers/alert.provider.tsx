import { createContext, useContext, useState } from "react"

export enum AlertType {
    success,
    error,
    info,
    warning
}

export interface Alert {
    message: string
    type: AlertType
}

interface AlertContext {
    alerts: Alert[]
    addAlert: (alert: Alert) => void
}

const AlertContext = createContext<AlertContext>({ alerts: [], addAlert: null! })


const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([])

    function addAlert(alert: Alert) {
        setAlerts([...alerts, alert])
    }

    const value = { alerts, addAlert }
    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}


export function useAlerts() {
    return useContext(AlertContext)
}

export default AlertProvider