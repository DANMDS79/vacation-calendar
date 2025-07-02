import { useState, useEffect } from 'react'
import { Calendar, Users, Building2, AlertTriangle, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import EmployeeManagement from './components/EmployeeManagement.jsx'
import VacationCalendar from './components/VacationCalendar.jsx'
import ConflictDetection from './components/ConflictDetection.jsx'
import Dashboard from './components/Dashboard.jsx'
import Approval from './components/Approval.jsx'
  // Funções para aprovar/rejeitar férias
  const handleApproveVacation = async (vacationId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/vacations/${vacationId}/approve`, {
      method: 'POST',
      credentials: 'include',
    })
    // Atualiza lista após ação
    await updateVacation(vacationId, {})
  }
  const handleRejectVacation = async (vacationId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/vacations/${vacationId}/reject`, {
      method: 'POST',
      credentials: 'include',
    })
    await updateVacation(vacationId, {})
  }
import { useManagements, useCoordinations, useEmployees, useVacations } from './hooks/useApi.js'
import './App.css'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok) {
        onLogin(data.user)
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch {
      setError('Erro de conexão com o servidor')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Calendário de Férias - Diretoria Financeira</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Usar hooks da API
  const { managements, loading: managementsLoading } = useManagements()
  const { coordinations, loading: coordinationsLoading } = useCoordinations()
  const { employees, loading: employeesLoading, createEmployee, updateEmployee, deleteEmployee, refetch } = useEmployees()
  const { vacations, loading: vacationsLoading, createVacation, updateVacation, deleteVacation } = useVacations()

  const totalEmployees = employees.length
  const controladoriaCount = employees.filter(emp => emp.gerencia_id === 1).length
  const financeiraCount = employees.filter(emp => emp.gerencia_id === 2).length

  useEffect(() => {
    // (Opcional) Verificar sessão existente
  }, [])

  // Mostrar loading enquanto carrega os dados iniciais
  if (managementsLoading || coordinationsLoading || employeesLoading || vacationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  // Controle de abas por papel
  const isAdmin = user.role === 'admin'
  const isGerente = user.role === 'gerente'
  const isDiretor = user.role === 'diretor'
  const isCoordenador = user.role === 'coordenador'
  const isAnalista = user.role === 'analista'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calendário de Férias</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão - Diretoria</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Diretoria Executiva</p>
                <p className="text-xs text-gray-600">Controladoria ({controladoriaCount}) • Financeira ({financeiraCount}) • Total: {totalEmployees} funcionários</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            {(isAdmin || isGerente || isDiretor || isCoordenador) && (
              <TabsTrigger value="employees" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Funcionários</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Calendário</span>
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Conflitos</span>
            </TabsTrigger>
            {user.role === 'aprovador' && (
              <TabsTrigger value="approval" className="flex items-center space-x-2">
                <span> Aprovação </span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              managements={managements}
              coordinations={coordinations}
              employees={employees}
              vacations={vacations}
              user={user}
            />
          </TabsContent>

          {(isAdmin || isGerente || isDiretor || isCoordenador) && (
            <TabsContent value="employees">
              <EmployeeManagement 
                managements={managements}
                coordinations={coordinations}
                employees={employees}
                vacations={vacations}
                onCreateEmployee={createEmployee}
                onUpdateEmployee={updateEmployee}
                onDeleteEmployee={deleteEmployee}
                onCreateVacation={createVacation}
                onDeleteVacation={deleteVacation}
                user={user}
                refetchEmployees={refetch}
              />
            </TabsContent>
          )}

          <TabsContent value="calendar">
            <VacationCalendar 
              managements={managements}
              coordinations={coordinations}
              employees={employees}
              vacations={vacations}
              user={user}
            />
          </TabsContent>

          <TabsContent value="conflicts">
            <ConflictDetection 
              managements={managements}
              coordinations={coordinations}
              employees={employees}
              vacations={vacations}
              user={user}
            />
          </TabsContent>

          {user.role === 'aprovador' && (
            <TabsContent value="approval">
              <Approval 
                vacations={vacations}
                employees={employees}
                user={user}
                onApprove={handleApproveVacation}
                onReject={handleRejectVacation}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export default App

