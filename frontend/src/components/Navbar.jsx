// Navbar with navigation links and logout; renders based on auth and role.

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUserInfo, removeToken } from '../utils/auth.js'

export default function Navbar() {
  const user = getUserInfo()
  const isAdmin = user?.role === 'admin'
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    removeToken()
    navigate('/login')
  }

  const NavLink = ({ to, children }) => (
    <Link to={to} className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.startsWith(to) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
      {children}
    </Link>
  )

  return (
    <nav className="bg-white border-b">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold">Library</Link>
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/books">Books</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
              {isAdmin && <NavLink to="/users">Users</NavLink>}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">Hi, {user.name}</span>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}


