import { useState } from 'react'
import { MDBNavbar } from 'mdb-react-ui-kit'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth.provider'
type Props = {}

enum HeaderNavItemsType {
  NoItems,
  NewUser,
  LoggedIn
}

const Header = (props: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(true)

  const { logout, isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  function performLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className='header'>
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setNavCollapsed(!navCollapsed)}
              aria-controls="navbarExample01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className={`navbar-collapse ${navCollapsed ? 'collapse' : ''}`} id="navbarExample01">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {isLoggedIn() ? (
                  <>
                    <li className="nav-item active">
                      <Link className="nav-link" to="/dashboard">Home</Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Logs</a>
                    </li>
                    <li className="nav-item">
                      <button className="btn btn-secondary nav-link" onClick={performLogout}>Logout</button>
                    </li>
                  </>
                ) :
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Login</Link>
                    </li>
                  </>}
                <li className="nav-item">
                  <a className="nav-link" href="#">About</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default Header