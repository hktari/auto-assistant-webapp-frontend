import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth.provider'

import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

type Props = {}

enum HeaderNavItemsType {
  NoItems,
  NewUser,
  LoggedIn
}

const Header = (props: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNav, setShowNav] = useState(false);

  const { logout, isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  function performLogout() {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className='header'>
        <MDBNavbar expand='lg' light bgColor='light'>
          <MDBContainer fluid>
            <MDBNavbarBrand href='#'>MDDSZ Avtomatizacija</MDBNavbarBrand>
            <MDBNavbarToggler
              type='button'
              aria-expanded='false'
              aria-label='Toggle navigation'
              onClick={() => setShowNav(!showNav)}
            >
              <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
            <MDBCollapse navbar show={showNav} >
              <MDBNavbarNav className='justify-content-end'>
                {isLoggedIn() ? (
                  <>
                    <MDBNavbarItem active={true}>
                      <Link className="nav-link" to="/dashboard" onClick={() => setShowNav(!showNav)}>Home</Link>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <Link className="nav-link" to="/logs" onClick={() => setShowNav(!showNav)}>Logs</Link>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <Link className="nav-link" to="/about">About</Link>
                    </MDBNavbarItem>
                    <MDBNavbarItem >
                      <MDBBtn className='ms-lg-2 h-100' color='tertiary' onClick={() => {
                        setShowNav(false);
                        performLogout();
                      }}>
                        Logout
                      </MDBBtn>
                    </MDBNavbarItem>
                  </>
                ) :
                  <>
                    <MDBNavbarItem>
                      <Link className="nav-link" to="/">Login</Link>
                    </MDBNavbarItem>
                    <MDBNavbarItem>
                      <Link className="nav-link" to="/about">About</Link>
                    </MDBNavbarItem>
                  </>}
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      </header>
    </>
  )
}

export default Header