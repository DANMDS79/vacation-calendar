import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Users, Calendar, AlertTriangle, TrendingUp } from 'lucide-react'

function Dashboard({ managements, coordinations, employees, vacations }) {
  // Calcular estatísticas
  const totalEmployees = employees.length
  const activeVacations = vacations.filter(v => {
    const today = new Date()
    const start = new Date(v.data_inicio)
    const end = new Date(v.data_fim)
    return start <= today && today <= end && v.status === 'Aprovado'
  }).length

  const upcomingVacations = vacations.filter(v => {
    const today = new Date()
    const start = new Date(v.data_inicio)
    return start > today && v.status !== 'Concluído'
  }).length

  // Estatísticas por gerência
  const controladoriaEmployees = employees.filter(emp => emp.gerencia_id === 1)
  const financeiraEmployees = employees.filter(emp => emp.gerencia_id === 2)

  const controladoriaVacations = vacations.filter(v => {
    const employee = employees.find(emp => emp.id === v.employee_id)
    return employee && employee.gerencia_id === 1
  })

  const financeiraVacations = vacations.filter(v => {
    const employee = employees.find(emp => emp.id === v.employee_id)
    return employee && employee.gerencia_id === 2
  })

  // Estatísticas por coordenação
  const coordStats = coordinations.map(coord => {
    const coordEmployees = employees.filter(emp => emp.coordenacao_id === coord.id)
    const coordVacations = vacations.filter(v => {
      const employee = employees.find(emp => emp.id === v.employee_id)
      return employee && employee.coordenacao_id === coord.id
    })
    
    const activeVacs = coordVacations.filter(v => {
      const today = new Date()
      const start = new Date(v.data_inicio)
      const end = new Date(v.data_fim)
      return start <= today && today <= end && v.status === 'Aprovado'
    }).length

    return {
      ...coord,
      totalEmployees: coordEmployees.length,
      activeVacations: activeVacs,
      coveragePercentage: coordEmployees.length > 0 ? ((coordEmployees.length - activeVacs) / coordEmployees.length) * 100 : 100
    }
  })

  // Detectar conflitos críticos
  const criticalAlerts = coordStats.filter(coord => coord.coveragePercentage < 50)

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Controladoria: {controladoriaEmployees.length} • Financeira: {financeiraEmployees.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Férias Ativas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVacations}</div>
            <p className="text-xs text-muted-foreground">
              Funcionários em férias hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Férias Programadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingVacations}</div>
            <p className="text-xs text-muted-foreground">
              Próximas férias agendadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Coordenações com baixa cobertura
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticos */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticos de Cobertura
            </CardTitle>
            <CardDescription className="text-red-700">
              As seguintes coordenações estão com cobertura abaixo de 50%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalAlerts.map(coord => (
                <div key={coord.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">{coord.nome}</p>
                    <p className="text-sm text-red-600">
                      {coord.totalEmployees - coord.activeVacations} de {coord.totalEmployees} funcionários ativos
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {Math.round(coord.coveragePercentage)}% cobertura
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visão por gerência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerência de Controladoria</CardTitle>
            <CardDescription>{controladoriaEmployees.length} funcionários • {controladoriaVacations.length} férias registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {coordinations.filter(coord => coord.gerencia_id === 1).map(coord => {
              const coordStat = coordStats.find(cs => cs.id === coord.id)
              return (
                <div key={coord.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{coord.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {coordStat.totalEmployees} funcionários • {coordStat.activeVacations} em férias
                      </p>
                    </div>
                    <Badge variant={coordStat.coveragePercentage < 50 ? "destructive" : coordStat.coveragePercentage < 75 ? "secondary" : "default"}>
                      {Math.round(coordStat.coveragePercentage)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={coordStat.coveragePercentage} 
                    className="h-2"
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerência Financeira</CardTitle>
            <CardDescription>{financeiraEmployees.length} funcionários • {financeiraVacations.length} férias registradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {coordinations.filter(coord => coord.gerencia_id === 2).map(coord => {
              const coordStat = coordStats.find(cs => cs.id === coord.id)
              return (
                <div key={coord.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{coord.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {coordStat.totalEmployees} funcionários • {coordStat.activeVacations} em férias
                      </p>
                    </div>
                    <Badge variant={coordStat.coveragePercentage < 50 ? "destructive" : coordStat.coveragePercentage < 75 ? "secondary" : "default"}>
                      {Math.round(coordStat.coveragePercentage)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={coordStat.coveragePercentage} 
                    className="h-2"
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

