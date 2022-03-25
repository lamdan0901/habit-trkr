import React, { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from 'contexts/AuthProvider'
import './Login.scss'

export default function ForgotPassword() {
  const emailRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { requestResetPassword } = useAuth()
  let navigate = useNavigate()

  async function handleSubmit() {
    try {
      setError('')
      setLoading(true)
      await requestResetPassword(emailRef.current.value)
      navigate('/reset-password')
    } catch (error) {
      setError('Failed to Reset password: ' + error.response.data.message)
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Forgot Password</div>
        <div className="sub-title">{error !== '' && error}</div>

        <div className="fields">
          <div className="username">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
            </svg>
            <input type="email" ref={emailRef} placeholder="email" className="user-input" />
          </div>

          <button onClick={handleSubmit} className={loading ? 'signin-btn disabled' : 'signin-btn'}>
            Reset
          </button>

          <div className="link sign-up">
            Don't have an account?
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
