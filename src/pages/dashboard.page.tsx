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
  const [updatingLogTable, setUpdatingLogTable] = useState(false)
  const refreshLogsIntervalMs = 5000

  // refresh log table on interval
  useEffect(() => {
    const interval = setInterval(fetchLogs, refreshLogsIntervalMs)
    return () => {
      clearInterval(interval)
    }
  }, [user])

  // refresh log table on init
  useEffect(() => {
    fetchLogs()
  }, [user])

  async function fetchLogs() {
    try {
      console.log('fetching logs...')
      setUpdatingLogTable(true)
      setLogs(await logsService.all(user?.id!))
    } catch (error) {
      console.error('failed to fetch logs', error)
    } finally {
      setUpdatingLogTable(false)
    }
  }

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
        <div className="d-flex align-items-center mb-3">
          <h2 className="mb-0 flex-grow-1">Dnevnik</h2>
          <MDBSpinner className={!updatingLogTable ? 'd-none' : ''} size='sm' role='status' tag='span' />
        </div>
        <LogTable data={logs} />
      </section>

    </MDBContainer >
  )
}

export default DashboardPage