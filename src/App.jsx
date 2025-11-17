import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Payment from './pages/Payment'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/payment" element={user ? <Payment user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
