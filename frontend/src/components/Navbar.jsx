// Navbar with navigation links and logout; renders based on auth and role.

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getUserInfo, removeToken } from '../utils/auth.js'

export default function Navbar() {
  const user = getUserInfo()
  const isAdmin = user?.role === 'admin'
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const logout = () => {
    removeToken()
    navigate('/login')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const NavLink = ({ to, children, mobile = false }) => (
    <Link 
      to={to} 
      className={`${mobile ? 'block px-3 py-2 text-base' : 'px-3 py-2'} rounded-md font-medium ${
        location.pathname.startsWith(to) ? 'bg-gray-200' : 'hover:bg-gray-100'
      } ${mobile ? 'w-full text-left' : 'text-sm'}`}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  )

  return (
    <nav className="bg-white border-b">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-2">
            <Link to="/" className="font-semibold">Library</Link>
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/books">Books</NavLink>
                <NavLink to="/transactions">Transactions</NavLink>
                {isAdmin && <NavLink to="/users">Users</NavLink>}
                <NavLink to="/settings">Settings</NavLink>
              </div>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">Hi, {user.name}</div>
                  <NavLink to="/dashboard" mobile>Dashboard</NavLink>
                  <NavLink to="/books" mobile>Books</NavLink>
                  <NavLink to="/transactions" mobile>Transactions</NavLink>
                  {isAdmin && <NavLink to="/users" mobile>Users</NavLink>}
                  <NavLink to="/settings" mobile>Settings</NavLink>
                  <button 
                    className="block w-full text-left px-3 py-2 rounded-md font-medium hover:bg-gray-100"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link 
                    className="block w-full btn btn-secondary text-center" 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    className="block w-full btn btn-primary text-center" 
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


