import { useState } from 'react'

type Props = {}

enum HeaderNavItemsType {
  NoItems,
  NewUser,
  LoggedIn
}

const Header = (props: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)


  return (
    <>
      <header className='header'>
        header
      </header>
    </>
  )
}

export default Header