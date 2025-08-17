// Settings page for user profile management and account operations

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserInfo, removeToken, saveToken } from '../utils/auth.js'
import { updateProfile, updatePassword, deleteAccount } from '../services/users.js'

export default function Settings() {
  const navigate = useNavigate()
  const user = getUserInfo()
  const isAdmin = user?.role === 'admin'
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    
    try {
      const updatedUser = await updateProfile(profileForm)
      setMessage('Profile updated successfully!')
      
      // Update local storage with new user info
      const currentToken = localStorage.getItem('token')
      if (currentToken) {
        // Create updated user object for local storage
        const updatedUserInfo = { ...user, ...updatedUser }
        // Note: In a real app, you'd want the backend to return a new JWT with updated info
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setMessage('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    const confirmation = window.prompt('Type "DELETE" to confirm account deletion:')
    if (confirmation !== 'DELETE') {
      return
    }
    
    setLoading(true)
    
    try {
      await deleteAccount()
      removeToken()
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  const PasswordField = ({ name, value, onChange, placeholder, showKey }) => (
    <div className="relative">
      <input
        className="input pr-10"
        type={showPasswords[showKey] ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={() => setShowPasswords(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
        aria-label={showPasswords[showKey] ? "Hide password" : "Show password"}
      >
        {showPasswords[showKey] ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122L7.758 7.758M12 12l2.122-2.122m-2.122 2.122L9.878 14.122m2.122-2.122L14.122 7.758" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  )

  return (
    <div className="container max-w-4xl py-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'password', label: 'Password', icon: '🔒' },
            ...(isAdmin ? [] : [{ id: 'danger', label: 'Danger Zone', icon: '⚠️' }])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <PasswordField
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  showKey="current"
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <PasswordField
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password (min 6 characters)"
                  showKey="new"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <PasswordField
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  showKey="confirm"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Danger Zone Tab - Hidden for Admin Users */}
        {activeTab === 'danger' && !isAdmin && (
          <div className="card border-red-200">
            <h2 className="text-xl font-semibold mb-6 text-red-600">Danger Zone</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
              <p className="text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
