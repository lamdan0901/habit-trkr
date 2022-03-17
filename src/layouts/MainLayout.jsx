import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { ToastContainer } from 'react-toastify'

import Sidebar from 'components/Sidebar/Sidebar'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout(props) {
  return (
    <main>
      <ToastContainer autoClose={2500} />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="main-layout">
          <Sidebar
            habits={props.habits}
            setIsSearching={props.setIsSearching}
            onSetSearchHabits={props.onSetSearchHabits}
          />
          <div className="content-and-nav">
            <NavBar />
            <div className="children">{props.children}</div>
          </div>
        </div>
      </LocalizationProvider>
    </main>
  )
}
