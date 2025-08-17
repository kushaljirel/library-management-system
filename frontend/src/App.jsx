// Root app component setting up routes and layout with Navbar and protected routes.

import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Books from './pages/Books.jsx'
import BookForm from './pages/BookForm.jsx'
import Users from './pages/Users.jsx'
import Transactions from './pages/Transactions.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/:id/edit" element={<BookForm />} />
            <Route path="/users" element={<Users />} />
          </Route>

          <Route path="*" element={<div className="container"><h1 className="text-xl font-semibold">Page Not Found</h1></div>} />
        </Routes>
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        Library Management System
      </footer>
    </div>
  )
}


