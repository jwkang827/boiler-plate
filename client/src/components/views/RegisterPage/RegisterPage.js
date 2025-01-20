import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../../_actions/user_action'

function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [Email, setEmail] = useState("")
  const [Name, setName] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const onSubmitHandler = (event) => {
    event.preventDefault()

    if(Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인이 같아야 합니다.')
    }
    let body = {
      email: Email,
      namd: Name,
      password: Password
    }

    dispatch(registerUser(body))
    .then(response => {
      if (response.payload.success) {
        navigate('/')
      } else {
        alert('Failed to sign up')
      }
    })
  }

  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={(event) => { setEmail(event.currentTarget.value) }} />
        <label>Name</label>
        <input type="text" value={Name} onChange={(event) => { setName(event.currentTarget.value) }} />
        <label>Password</label>
        <input type="password" value={Password} onChange={(event) => { setPassword(event.currentTarget.value) }} />
        <label>ConfirmPassword</label>
        <input type="password" value={ConfirmPassword} onChange={(event) => { setConfirmPassword(event.currentTarget.value) }} />
        <br />
        <button type="submit">
          register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
