import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const {user,logout}= useAuth()
  return (
    <div>
        <h1>Dashboard</h1>
        <h2>Welcome, {user?.name}</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>

        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Dashboard