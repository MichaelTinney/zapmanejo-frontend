import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = isRegister ? '/api/auth/register' : '/api/auth/login'
    try {
      const res = await api.post(url, { email, password, name: email.split('@')[0] })
      if (!isRegister) {
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        navigate('/')
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Erro')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-green-800">ZapManejo</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border px-5 py-4 text-lg"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border px-5 py-4 text-lg"
            required
          />
          <button className="w-full rounded-lg bg-green-600 py-4 text-xl font-bold text-white hover:bg-green-700">
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center">
          {isRegister ? 'Já tem conta?' : 'Novo aqui?'}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-green-600 font-bold">
            {isRegister ? 'Faça login' : 'Crie sua conta'}
          </button>
        </p>
      </div>
    </div>
  )
}
