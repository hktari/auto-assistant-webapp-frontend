import React from 'react'
import { Outlet } from 'react-router-dom'
import AlertContainer from './alerts/alert-container.component'

import Footer from './footer.component'
import Header from './header.component'


const Layout = () => {
    return (
        <>
            <div className="page-wrap">
                <Header />
                <main className='main'>
                    <Outlet />
                </main>
                <AlertContainer />
            </div>
            <div className="site-footer">
                <Footer />
            </div>
        </>)
}

export default Layout