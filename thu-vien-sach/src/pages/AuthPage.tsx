import React from 'react'
import LoginForm from '../components/auths/LoginForm'
import RegisterForm from '../components/auths/RegisterForm'

interface Props {
  action: 'LOGIN' | 'REGISTER'
}

const AuthPage = ( props: Props ) => {

  const {action} =  props

  return (
    <div className="d-flex justify-content-center align-items center">
      {action === 'LOGIN' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}

export default AuthPage