import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Payment() {
  const [slotsLeft, setSlotsLeft] = useState(200)

  useEffect(() => {
    api.get('/api/payment/slots').then(res => {
      setSlotsLeft(200 - res.data.sold)
    }).catch(() => setSlotsLeft(137)) // fallback
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-green-800 mb-12">Escolha seu plano</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Mensal */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Mensal</h2>
            <p className="text-6xl font-bold text-green-700 mb-6">R$ 250<span className="text-2xl">/mês</span></p>
            <ul className="text-left space-y-3 mb-8">
              <li>Todos os recursos</li>
              <li>Suporte por WhatsApp</li>
              <li>Atualizações para sempre</li>
            </ul>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-xl text-xl font-bold">
              Assinar Mensal
            </button>
          </div>

          {/* Vitalício Early Adopter */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-10 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-yellow-400 text-black px-6 py-2 rounded-bl-2xl font-bold">
              APENAS {slotsLeft} VAGAS
            </div>
            <h2 className="text-4xl font-bold mb-4">Early Adopter Vitalício</h2>
            <p className="text-7xl font-bold mb-2">R$ 2.500</p>
            <p className="text-2xl mb-8">pagamento único</p>
            <ul className="text-left space-y-3 mb-8">
              <li>Pague uma vez, use para sempre</li>
              <li>Seu nome como Parceiro Fundador</li>
              <li>Suporte prioritário vitalício</li>
            </ul>
            <button className="w-full bg-white text-orange-600 hover:bg-gray-100 py-5 rounded-xl text-xl font-bold">
              Garantir Minha Vaga Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
