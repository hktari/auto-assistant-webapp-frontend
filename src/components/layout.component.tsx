import React from 'react'
import { Outlet } from 'react-router-dom'

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
            </div>
            <Footer />
        </>)
}

export default Layout