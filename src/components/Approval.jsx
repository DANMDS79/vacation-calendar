import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'

function Approval({ vacations, employees, user, onApprove, onReject }) {
  // Filtro por status
  const [statusFilter, setStatusFilter] = useState('Planejado')
  const [notification, setNotification] = useState(null)
  const myDepartment = user.department
  const myVacations = vacations.filter(vac => {
    const emp = employees.find(e => e.id === vac.employee_id)
    return emp && emp.gerencia_id && (
      (myDepartment === 'Gerencia de Controladoria' && emp.gerencia_id === 1) ||
      (myDepartment === 'Gerencia Financeira' && emp.gerencia_id === 2) ||
      (myDepartment === 'Diretoria Financeira' && emp.gerencia_id === 3)
    ) && (statusFilter === 'Todos' || vac.status === statusFilter)
  })

  const [loadingId, setLoadingId] = useState(null)

  const handleApprove = async (vacationId) => {
    setLoadingId(vacationId)
    await onApprove(vacationId)
    setLoadingId(null)
    setNotification({ type: 'success', message: 'Férias aprovadas com sucesso!' })
    setTimeout(() => setNotification(null), 3000)
  }
  const handleReject = async (vacationId) => {
    setLoadingId(vacationId)
    await onReject(vacationId)
    setLoadingId(null)
    setNotification({ type: 'error', message: 'Férias rejeitadas.' })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovação de Férias</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Notificações */}
        {notification && (
          <div className={`mb-4 p-3 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-red-100 text-red-800 border border-red-400'}`}>
            {notification.message}
          </div>
        )}
        {/* Filtro por status */}
        <div className="mb-4 flex gap-2 items-center">
          <span className="font-medium">Filtrar por status:</span>
          <select className="border rounded p-1" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>

            <option value="Todos">Todos</option>
            <option value="Planejado">Planejado</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Rejeitado">Rejeitado</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>
        {myVacations.length === 0 ? (
          <div className="text-gray-500">Nenhuma solicitação de férias encontrada para o filtro selecionado.</div>
        ) : (
          <div className="space-y-4">
            {myVacations.map(vac => {
              const emp = employees.find(e => e.id === vac.employee_id)
              return (
                <div key={vac.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50">
                  <div>
                    <div className="font-semibold">{emp?.nome}</div>
                    <div className="text-sm text-gray-600">{vac.data_inicio} até {vac.data_fim}</div>
                    <div className="text-xs text-gray-500">Status: {vac.status}</div>
                  </div>
                  {vac.status === 'Planejado' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" disabled={loadingId===vac.id} onClick={() => handleApprove(vac.id)}>
                        Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" disabled={loadingId===vac.id} onClick={() => handleReject(vac.id)}>
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default Approval
