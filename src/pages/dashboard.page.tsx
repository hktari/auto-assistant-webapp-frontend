import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LogTable from '../components/log-table.component'
import { Credentials, LogEntry } from '../interface/common.interface'
import { useAuth } from '../providers/auth.provider'
import accountService from '../services/account/account.service'
import credentialsService from '../services/account/credentials.service'
import logsService from '../services/account/logs.service'

type DashboardPageProps = {}

const DashboardPage = (props: DashboardPageProps) => {
  const refreshLogsIntervalMs = 5000
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [updatingAutomationEnabled, setUpdatingAutomationEnabled] = useState(false)
  const [updatingLogTable, setUpdatingLogTable] = useState(false)
  const [credentials, setCredentials] = useState<Credentials | null>(null)

  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  // refresh log table on interval
  useEffect(() => {
    const interval = setInterval(fetchLogs, refreshLogsIntervalMs)
    return () => {
      clearInterval(interval)
    }
  }, [user])

  // refresh on init
  useEffect(() => {
    fetchLogs()
    fetchCredentials()
  }, [user])


  async function fetchCredentials() {
    try {
      console.log('fetching credentials...')
      setCredentials(await credentialsService.getCredentials(user?.id!))
    } catch (error) {
      console.error('failed to fetch credentials', error)
      setCredentials(null)
    }
  }

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

        <div hidden={credentials !== null}>
          <MDBBtn color='primary' onClick={() => navigate('/credentials')}>
            Nastavi avtomatizacijo
          </MDBBtn>
        </div>

        <div hidden={credentials == null}>
          <div className="mb-2">
            <span className='fs-5'>Uporabnik: {credentials?.username}</span>
          </div>

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
        </div>
      </section>

      <section data-section="logs">
        <div className="d-flex align-items-center mb-3">
          <h2 className="mb-0 flex-grow-1">Dnevnik</h2>
          <MDBSpinner className={!updatingLogTable ? 'd-none' : ''} size='sm' role='status' tag='span' />
        </div>
        <LogTable data={logs} reduced={true} />
      </section>

    </MDBContainer >
  )
}

export default DashboardPage