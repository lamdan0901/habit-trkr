import { Link } from 'react-router-dom'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useClockState } from '../../contexts/UtilitiesProvider'
import { useAuth } from '../../contexts/AuthProvider'

import { AiTwotoneSetting } from 'react-icons/ai'
import { MdDarkMode } from 'react-icons/md'
import { GoSignOut } from 'react-icons/go'
import './NavBar.scss'

export default function NavBar() {
  const clockState = useClockState()
  const { signOut, username }: any = useAuth()
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3) //3 is the number of items in the dropdown menu

  return (
    <nav className="navbar">
      <h3 className="digi-clock">{clockState}</h3>

      {/* @ts-ignore */}
      <div {...buttonProps} className="user-info">
        <label className="user-name">{username}</label>
      </div>

      <div className={isOpen ? 'visible' : ''} role="menu">
        <Link
          {...itemProps[0]}
          to="/#"
          className="dropdown-item"
          onClick={(e: any) => {
            e.stopPropagation()
          }}>
          <AiTwotoneSetting />
          My profile
        </Link>
        <Link
          {...itemProps[1]}
          to="/#"
          className="dropdown-item"
          onClick={(e: any) => {
            e.stopPropagation()
          }}>
          <MdDarkMode />
          Dark theme
        </Link>
        <Link
          {...itemProps[2]}
          to="/#"
          className="dropdown-item"
          onClick={(e: any) => {
            e.stopPropagation()
            signOut()
          }}>
          <GoSignOut />
          Sign out
        </Link>
      </div>
    </nav>
  )
}
