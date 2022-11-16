import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import LogTable from '../components/log-table.component'
import { LogEntry } from '../interface/common.interface'
import { useAuth } from '../providers/auth.provider'
import accountService from '../services/account/account.service'
import logsService from '../services/account/logs.service'

type DashboardPageProps = {}

const DashboardPage = (props: DashboardPageProps) => {
  const { user, updateUser } = useAuth()
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLogs(await logsService.all("1"))
      } catch (error) {
        console.error('failed to fetch logs', error)
      }
    }

    fetchLogs()
  }, [user])

  async function setAutomationEnabled(enabled: boolean) {
    try {
      await updateUser(enabled)
      console.log('OK')
    } catch (error) {
      console.error('failed to update automationEnabled', error)
    }
  }

  return (
    <MDBContainer>
      <section data-section="automation" className='mb-4'>
        <h2 className='mb-3'>Avtomatizacija</h2>
        {user?.automationEnabled ?
          <MDBBtn size='lg' color='danger' block={true} onClick={() => setAutomationEnabled(false)}>IZKLOPI</MDBBtn>
          : <MDBBtn size='lg' color='success' block={true} onClick={() => setAutomationEnabled(true)}>VKLOPI</MDBBtn>}
      </section>

      <section data-section="logs">
        <h2 className="mb-3">Dnevnik</h2>
        <LogTable data={logs} />
      </section>

    </MDBContainer >
  )
}

export default DashboardPage