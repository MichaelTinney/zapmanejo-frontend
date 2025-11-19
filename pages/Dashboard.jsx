import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [animals, setAnimals] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchAnimals()
  }, [navigate])

  const fetchAnimals = async () => {
    try {
      const res = await axios.get('/api/animals')
      setAnimals(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Bem-vindo, {user?.name || 'Fazendeiro'}!
          </h1>
          <p className="text-gray-600 text-lg">Seu plano: <strong className="text-green-700">{user?.plan === 'lifetime' ? 'Vitalício Early Adopter' : 'Mensal'}</strong></p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-green-800">Rebanho</h2>
            <button onClick={() => navigate('/payment')} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold">
              {user?.plan === 'trial' ? 'Ativar Plano Completo' : 'Ver Plano'}
            </button>
          </div>

          {animals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-600 mb-6">Seu rebanho está vazio</p>
              <p className="text-lg text-gray-500">Adicione animais via WhatsApp, CSV ou manualmente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-6 py-4 text-left">Brinco</th>
                    <th className="px-6 py-4 text-left">Sexo</th>
                    <th className="px-6 py-4 text-left">Raça</th>
                    <th className="px-6 py-4 text-left">Nascimento</th>
                  </tr>
                </thead>
                <tbody>
                  {animals.map(a => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold">{a.brinco}</td>
                      <td className="px-6 py-4">{a.sex}</td>
                      <td className="px-6 py-4">{a.breed}</td>
                      <td className="px-6 py-4">{new Date(a.birth_date).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
