import React, { useContext, useEffect, useState } from 'react'

const TimeContext = React.createContext()
const SidebarContext = React.createContext()

export function useClockState() {
  return useContext(TimeContext)
}
export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [clockState, setClockState] = useState(formatTime(new Date().toLocaleTimeString()))

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentClockState = formatTime(new Date().toLocaleTimeString('en-US'))
      if (currentClockState !== clockState) {
        setClockState(currentClockState)
      }
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function formatTime(time) {
    if (time.slice(0, 2) === '10' || time.slice(0, 2) === '11' || time.slice(0, 2) === '12') {
      return time.slice(0, 5) + ' ' + time.slice(9)
    } else {
      return '0' + time.slice(0, 4) + ' ' + time.slice(8)
    }
  }

  return (
    <TimeContext.Provider value={clockState}>
      <SidebarContext.Provider value={[sidebarOpen, toggleSidebar]}>
        {children}
      </SidebarContext.Provider>
    </TimeContext.Provider>
  )
}
