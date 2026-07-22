import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, deleteUser, getMe, updateUser } from '../api'
import { clearToken, isLoggedIn } from '../auth'
import type { UserProfile } from '../types'

export default function ProfilePage() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }

    getMe()
      .then((data) => {
        setProfile(data)
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setEmail(data.email)
        setPhoneNumber(data.phoneNumber ?? '')
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!profile) return
    setError(null)
    setSuccess(null)

    try {
      const updated = await updateUser(profile.id, {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || null,
      })
      setProfile(updated)
      setSuccess('Profile updated.')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!profile) return
    setPasswordError(null)
    setPasswordSuccess(null)

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    try {
      await changePassword(profile.id, currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess('Password changed.')
    } catch (err) {
      setPasswordError((err as Error).message)
    }
  }

  async function handleDeleteAccount() {
    if (!profile) return
    if (!window.confirm('Delete your account? This cannot be undone.')) return

    try {
      await deleteUser(profile.id)
      clearToken()
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) return <p>Loading profile...</p>

  return (
    <div>
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit} className="create-item-form">
        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>

        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Phone number
          <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>

        <button type="submit">Save Changes</button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <h2>Change Password</h2>
      <form onSubmit={handlePasswordSubmit} className="create-item-form">
        <label>
          Current password
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </label>

        <label>
          New password
          <input type="password" value={newPassword} minLength={8}
            onChange={(e) => setNewPassword(e.target.value)} required />
        </label>

        <label>
          Confirm new password
          <input type="password" value={confirmPassword} minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>

        <button type="submit">Change Password</button>
        {passwordSuccess && <p className="success">{passwordSuccess}</p>}
        {passwordError && <p className="error">{passwordError}</p>}
      </form>

      <div className="danger-zone">
        <h2>Delete Account</h2>
        <p>You can't delete your account while you still have listed items.</p>
        <button className="remove-button" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  )
}
