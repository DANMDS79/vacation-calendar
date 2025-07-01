import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calendar, Filter } from 'lucide-react'

function VacationCalendar({ managements, coordinations, employees, vacations, user }) {
  const [selectedManagement, setSelectedManagement] = useState('all')
  const [selectedCoordination, setSelectedCoordination] = useState('all')

  const isAdmin = user.role === 'admin'
  const isGerente = user.role === 'gerente'
  const isDiretor = user.role === 'diretor'
  const isCoordenador = user.role === 'coordenador'
  const isAnalista = user.role === 'analista'

  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id)
    return employee ? employee.nome : 'N/A'
  }

  const getManagementName = (id) => {
    const management = managements.find(m => m.id === id)
    return management ? management.nome : 'N/A'
  }

  const getCoordinationName = (id) => {
    const coordination = coordinations.find(c => c.id === id)
    return coordination ? coordination.nome : 'N/A'
  }

  const getEmployeeManagement = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId)
    return employee ? employee.gerencia_id : null
  }

  const getEmployeeCoordination = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId)
    return employee ? employee.coordenacao_id : null
  }

  // Filtrar férias baseado na seleção
  const filteredVacations = vacations.filter(vacation => {
    const employeeManagement = getEmployeeManagement(vacation.employee_id)
    const employeeCoordination = getEmployeeCoordination(vacation.employee_id)

    if (selectedManagement !== 'all' && employeeManagement !== parseInt(selectedManagement)) {
      return false
    }

    if (selectedCoordination !== 'all' && employeeCoordination !== parseInt(selectedCoordination)) {
      return false
    }

    return true
  })

  // Coordenações filtradas baseadas na gerência selecionada
  const filteredCoordinations = selectedManagement === 'all' 
    ? coordinations 
    : coordinations.filter(coord => coord.gerencia_id === parseInt(selectedManagement))

  // Gerar calendário simples para os próximos 3 meses
  const generateCalendarDays = () => {
    const today = new Date()
    const days = []
    
    for (let i = -30; i <= 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  const getVacationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return filteredVacations.filter(vacation => {
      const start = new Date(vacation.data_inicio)
      const end = new Date(vacation.data_fim)
      return date >= start && date <= end
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-500'
      case 'Planejado': return 'bg-blue-500'
      case 'Em andamento': return 'bg-yellow-500'
      case 'Concluído': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getManagementColor = (managementId) => {
    return managementId === 1 ? 'border-l-blue-500' : 'border-l-green-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Calendário de Férias</h2>
          <p className="text-muted-foreground">Visualização temporal das férias programadas</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedManagement} onValueChange={(value) => {
              setSelectedManagement(value)
              setSelectedCoordination('all')
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por gerência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Gerências</SelectItem>
                {managements.map(management => (
                  <SelectItem key={management.id} value={management.id.toString()}>
                    {management.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={selectedCoordination} onValueChange={setSelectedCoordination}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por coordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Coordenações</SelectItem>
              {filteredCoordinations.map(coordination => (
                <SelectItem key={coordination.id} value={coordination.id.toString()}>
                  {coordination.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Aprovado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Planejado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Em andamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm">Concluído</span>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <div className="w-4 h-4 border-l-4 border-l-blue-500 bg-gray-100"></div>
              <span className="text-sm">Controladoria</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-l-green-500 bg-gray-100"></div>
              <span className="text-sm">Financeira</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de férias */}
      <Card>
        <CardHeader>
          <CardTitle>Férias Programadas</CardTitle>
          <CardDescription>
            {filteredVacations.length} períodos de férias
            {selectedManagement !== 'all' && ` - ${getManagementName(parseInt(selectedManagement))}`}
            {selectedCoordination !== 'all' && ` - ${getCoordinationName(parseInt(selectedCoordination))}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredVacations
              .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
              .map(vacation => {
                const employee = employees.find(emp => emp.id === vacation.employee_id)
                const managementId = employee ? employee.gerencia_id : null
                const coordinationId = employee ? employee.coordenacao_id : null
                
                return (
                  <div 
                    key={vacation.id} 
                    className={`p-4 border rounded-lg border-l-4 ${getManagementColor(managementId)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getEmployeeName(vacation.employee_id)}</h4>
                          <Badge variant="outline">
                            {getCoordinationName(coordinationId)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getManagementName(managementId)} • {employee?.cargo}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(vacation.data_inicio).toLocaleDateString('pt-BR')} até {' '}
                            {new Date(vacation.data_fim).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {vacation.observacoes && (
                          <p className="text-sm text-muted-foreground italic">
                            {vacation.observacoes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(vacation.status)} text-white`}>
                          {vacation.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.ceil((new Date(vacation.data_fim) - new Date(vacation.data_inicio)) / (1000 * 60 * 60 * 24))} dias
                        </p>
                      </div>
                    </div>

                    {/* Ações - visíveis apenas para gerente, diretor ou coordenador */}
                    {(isAdmin || isGerente || isDiretor || isCoordenador) && vacation.status === 'Pendente Aprovação' && (
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => aprovarFerias(vacation.id)} 
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => reprovarFerias(vacation.id)} 
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          Reprovar
                        </button>
                      </div>
                    )}

                    {/* Editar - visível apenas para o próprio funcionário ou admin */}
                    {(isAdmin || (isAnalista && vacation.employee_id === user.id)) && (
                      <div className="flex gap-2 mt-4">
                        <button 
                          onClick={() => editarFerias(vacation.id)} 
                          className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VacationCalendar

