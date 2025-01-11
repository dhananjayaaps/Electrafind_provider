import React from 'react'
import Navbar from '../Navbar/Navbar'
import Title from '../Title/Title'
import Login from '../Login/Login'

const AdminLoginPage = () => {
  return (
    <div>
      <Navbar/>
      <Title title='Admin Login' />
      <Login/>
    </div>
  )
}

export default AdminLoginPage