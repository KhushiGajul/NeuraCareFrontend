import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col">
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout