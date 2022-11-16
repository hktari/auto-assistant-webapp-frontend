import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit'
import React from 'react'
import { LogEntry } from '../interface/common.interface'
import LogTableEntry from './log/log-entry.component'

type LogTableProps = {
  data: LogEntry[]
  reduced?: boolean
}

const LogTable = ({ data, reduced = false }: LogTableProps) => {

  return (
    <MDBTable small={true} responsive={true}>
      <MDBTableHead>
        <tr>
          <th scope='col'>Datum</th>
          <th className={`${reduced ? 'd-none' : ''}`} scope='col'>Sporočilo</th>
          <th className={`${reduced ? 'd-none' : ''}`} scope='col'>Napaka</th>
          <th className={`${reduced ? 'd-none' : ''}`} scope='col'>Tip akcije</th>
          <th scope='col'>Akcija</th>
          <th scope='col'>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {data.map(entry => <LogTableEntry entry={entry} reduced={reduced} />)}
      </MDBTableBody>
    </MDBTable>)
}

export default LogTable