import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
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
  const [updatingAutomationEnabled, setUpdatingAutomationEnabled] = useState(false)

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
      setUpdatingAutomationEnabled(true)
      await updateUser(enabled)
    } catch (error) {
      console.error('failed to update automationEnabled', error)
    } finally {
      setUpdatingAutomationEnabled(false)
    }
  }

  return (
    <MDBContainer>
      <section data-section="automation" className='mb-4'>
        <h2 className='mb-3'>Avtomatizacija</h2>
        <MDBBtn
          size='lg'
          color={user?.automationEnabled ? 'danger' : 'success'}
          block={true}
          disabled={updatingAutomationEnabled}
          onClick={() => setAutomationEnabled(!user?.automationEnabled)}>
          <MDBSpinner className={!updatingAutomationEnabled ? 'd-none me-2' : 'me-2'} size='sm' role='status' tag='span' />
          <span hidden={!updatingAutomationEnabled}>Posodabljam...</span>
          <span hidden={updatingAutomationEnabled}>{user?.automationEnabled ? 'IZKLOPI' : 'VKLOPI'}</span>
        </MDBBtn>
      </section>

      <section data-section="logs">
        <h2 className="mb-3">Dnevnik</h2>
        <LogTable data={logs} />
      </section>

    </MDBContainer >
  )
}

export default DashboardPage