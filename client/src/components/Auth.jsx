import React, { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Auth = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  const viewLogin = (status) => {
    setError(null)
    setIsLogin(status)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (isLogin) {
      axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password
      })
        .then(res => {
          setCookie('Email', res.data.email)
          setCookie('Token', res.data.token)
          window.location.reload()
        })
        .catch(err => {
          if (err.response.status === 400) {
            setError(err.response.data.message)
          }
        })
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        email,
        password
      })
        .then(res => {
          setCookie('Email', res.data.email)
          setCookie('Token', res.data.token)
          window.location.reload()
        })
        .catch(err => {
          if (err.response.status === 400) {
            setError(err.response.data.message)
          }
          console.log(err)
        })
    }

  }

  return (
    <div className='auth-container'>
      <div className='auth-container-box'>
        <form>
          <h2>{isLogin ? 'login' : 'signup'}</h2>
          <input
            type='email'
            placeholder='email'
            onChange={(e) => {setEmail(e.target.value)}}
          />
          <input
            type='password'
            placeholder='password'
            onChange={(e) => {setPassword(e.target.value)}}
          />
          {!isLogin &&
            <input
              type='password'
              placeholder='confirm password'
              onChange={(e) => {setConfirmPassword(e.target.value)}}
            />}
          <button type='submit' onClick={handleSubmit}>{isLogin ? 'login' : 'signup'}</button>
          {error}
        </form>
        <div className='auth-options'>
          <button 
            onClick={() => viewLogin(true)}>
            login
          </button>
          <button 
            onClick={() => viewLogin(false)}>
            signup
          </button>
        </div>

      </div>
    </div>
  )
}

export default Auth