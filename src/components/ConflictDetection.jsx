import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { AlertTriangle, Users, Calendar, TrendingDown } from 'lucide-react'
import { useConflicts } from '../hooks/useApi.js'

function ConflictDetection({ managements, coordinations, employees, vacations }) {
  const { conflicts, loading, error } = useConflicts()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Analisando conflitos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar conflitos</AlertTitle>
        <AlertDescription>
          Não foi possível carregar a análise de conflitos. Tente novamente.
        </AlertDescription>
      </Alert>
    )
  }

  const { summary, overlaps, coverage, criticalPeriods } = conflicts

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'default'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default: return <AlertTriangle className="h-4 w-4 text-blue-600" />
    }
  }

  const totalConflicts = summary?.total_conflicts || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Detecção de Conflitos</h2>
          <p className="text-muted-foreground">Identificação automática de problemas de agendamento</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-red-600">{totalConflicts}</p>
          <p className="text-sm text-muted-foreground">conflitos detectados</p>
        </div>
      </div>

      {/* Resumo de conflitos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sobreposições</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.overlap_conflicts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Férias com datas sobrepostas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problemas de Cobertura</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.coverage_issues || 0}</div>
            <p className="text-xs text-muted-foreground">
              Coordenações com baixa cobertura
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Períodos Críticos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.critical_periods || 0}</div>
            <p className="text-xs text-muted-foreground">
              Períodos com muitas férias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conflitos de sobreposição */}
      {overlaps && overlaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Conflitos de Sobreposição
            </CardTitle>
            <CardDescription>
              Funcionários com férias em datas sobrepostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overlaps.map((conflict, index) => (
                <Alert key={index} className={conflict.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(conflict.severity)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        Sobreposição Detectada
                        <Badge variant={getSeverityColor(conflict.severity)}>
                          {conflict.severity === 'high' ? 'Mesma Coordenação' : 'Coordenações Diferentes'}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div className="space-y-2">
                          <div>
                            <strong>{conflict.vacation1.employee?.nome}</strong> ({conflict.vacation1.coordination?.nome})
                            <br />
                            <span className="text-sm">
                              {new Date(conflict.vacation1.data_inicio).toLocaleDateString('pt-BR')} até {new Date(conflict.vacation1.data_fim).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div>
                            <strong>{conflict.vacation2.employee?.nome}</strong> ({conflict.vacation2.coordination?.nome})
                            <br />
                            <span className="text-sm">
                              {new Date(conflict.vacation2.data_inicio).toLocaleDateString('pt-BR')} até {new Date(conflict.vacation2.data_fim).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-red-700">
                            Período de sobreposição: {new Date(conflict.overlap_start).toLocaleDateString('pt-BR')} até {new Date(conflict.overlap_end).toLocaleDateString('pt-BR')} ({conflict.overlap_days} dias)
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problemas de cobertura */}
      {coverage && coverage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Problemas de Cobertura
            </CardTitle>
            <CardDescription>
              Coordenações com cobertura insuficiente de pessoal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coverage.slice(0, 10).map((issue, index) => (
                <Alert key={index} className={issue.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {issue.coordination?.nome}
                        <Badge variant={getSeverityColor(issue.severity)}>
                          {Math.round(issue.coverage_percentage)}% cobertura
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div>
                          <strong>Data:</strong> {new Date(issue.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <strong>Situação:</strong> {issue.on_vacation_count} de {issue.total_employees} funcionários em férias
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Funcionários em férias:</strong> {issue.employees_on_vacation?.join(', ')}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Períodos críticos */}
      {criticalPeriods && criticalPeriods.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Períodos Críticos
            </CardTitle>
            <CardDescription>
              Períodos com alto volume de férias simultâneas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalPeriods.map((period, index) => (
                <Alert key={index} className={period.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}>
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(period.severity)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        Período de Alto Volume
                        <Badge variant={getSeverityColor(period.severity)}>
                          {period.max_vacations} funcionários
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <div>
                          <strong>Período:</strong> {new Date(period.start_date).toLocaleDateString('pt-BR')}
                          {period.start_date !== period.end_date && 
                            ` até ${new Date(period.end_date).toLocaleDateString('pt-BR')}`
                          }
                        </div>
                        <div>
                          <strong>Impacto:</strong> {period.max_vacations} funcionários em férias simultaneamente
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {totalConflicts === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Nenhum Conflito Detectado</h3>
            <p className="text-green-600 text-center">
              Todas as férias estão bem organizadas e não há conflitos de agendamento no momento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ConflictDetection

