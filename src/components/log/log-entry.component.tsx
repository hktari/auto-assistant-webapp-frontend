import React from 'react'
import { LogEntry } from '../../interface/common.interface'

type LogTableEntryProps = {
    entry: LogEntry
    reduced?: boolean
}

const LogTableEntry = ({ entry, reduced = false }: LogTableEntryProps) => {

    return (
        <tr className={entry.status === 'failed' ? 'table-danger' : ''}>
            <td>{entry.timestamp.toLocaleString()}</td>
            <td className={`${reduced ? 'd-none' : ''}`}>{entry.message}</td>
            <td className={`${reduced ? 'd-none' : ''}`}>{entry.error}</td>
            <td className={`${reduced ? 'd-none' : ''}`}>{entry.config_type}</td>
            <td>{entry.action}</td>
            <td>{entry.status}</td>
        </tr>)
}

export default LogTableEntry