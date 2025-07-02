import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog.jsx'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

function EmployeeManagement({ 
  managements, 
  coordinations, 
  employees, 
  vacations, 
  onCreateEmployee, 
  onUpdateEmployee, 
  onDeleteEmployee, 
  onCreateVacation, 
  user 
}) {
  const [createdUserInfo, setCreatedUserInfo] = useState(null)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [isAddVacationOpen, setIsAddVacationOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    nome: '',
    gerencia_id: '',
    coordenacao_id: '',
    cargo: '',
    data_admissao: '',
    role: 'funcionario',
    department: '',
    username: '',
    email: '',
    password: ''
  })
  const [newVacation, setNewVacation] = useState({
    employee_id: '',
    data_inicio: '',
    data_fim: '',
    status: 'Planejado',
    observacoes: ''
  })

  const isAdmin = user.role === 'admin'
  const isGerente = user.role === 'gerente'
  const isDiretor = user.role === 'diretor'
  const isCoordenador = user.role === 'coordenador'
  const isAnalista = user.role === 'analista'

  const getManagementName = (id) => {
    const management = managements.find(m => m.id === id)
    return management ? management.nome : 'N/A'
  }

  const getCoordinationName = (id) => {
    const coordination = coordinations.find(c => c.id === id)
    return coordination ? coordination.nome : 'N/A'
  }

  const getEmployeeVacations = (employeeId) => {
    return vacations.filter(v => v.employee_id === employeeId)
  }

  const handleAddEmployee = async () => {
    if (newEmployee.nome && newEmployee.gerencia_id && newEmployee.coordenacao_id && newEmployee.role && newEmployee.department && newEmployee.username && newEmployee.email && newEmployee.password) {
      try {
        const employeeData = {
          ...newEmployee,
          gerencia_id: parseInt(newEmployee.gerencia_id),
          coordenacao_id: parseInt(newEmployee.coordenacao_id)
        }
        const result = await onCreateEmployee(employeeData)
        // Se o backend retornar info do usuário criado, exiba para o admin
        if (result && result.user && result.senha_padrao) {
          setCreatedUserInfo({
            username: result.user.username,
            email: result.user.email,
            senha: result.senha_padrao
          })
        }
        setNewEmployee({
          nome: '',
          gerencia_id: '',
          coordenacao_id: '',
          cargo: '',
          data_admissao: '',
          role: 'funcionario',
          department: '',
          username: '',
          email: '',
          password: ''
        })
        setIsAddEmployeeOpen(false)
      } catch (error) {
        console.error('Erro ao adicionar funcionário:', error)
        alert('Erro ao adicionar funcionário. Tente novamente.')
      }
    }
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee({
      ...employee,
      gerencia_id: employee.gerencia_id.toString(),
      coordenacao_id: employee.coordenacao_id.toString()
    })
    setIsEditEmployeeOpen(true)
  }

  const handleUpdateEmployee = async () => {
    if (editingEmployee.nome && editingEmployee.gerencia_id && editingEmployee.coordenacao_id) {
      try {
        const updatedEmployeeData = {
          ...editingEmployee,
          gerencia_id: parseInt(editingEmployee.gerencia_id),
          coordenacao_id: parseInt(editingEmployee.coordenacao_id)
        }
        await onUpdateEmployee(editingEmployee.id, updatedEmployeeData)
        setEditingEmployee(null)
        setIsEditEmployeeOpen(false)
      } catch (error) {
        console.error('Erro ao atualizar funcionário:', error)
        alert('Erro ao atualizar funcionário. Tente novamente.')
      }
    }
  }


  const handleDeleteEmployee = async (employeeId) => {
    try {
      await onDeleteEmployee(employeeId)
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error)
      alert('Erro ao excluir funcionário. Tente novamente.')
    }
  }

  const handleDeleteVacation = async (vacationId) => {
    try {
      await onDeleteVacation(vacationId)
    } catch (error) {
      console.error('Erro ao excluir férias:', error)
      alert('Erro ao excluir férias. Tente novamente.')
    }
  }

  const handleAddVacation = async () => {
    if (newVacation.employee_id && newVacation.data_inicio && newVacation.data_fim) {
      try {
        const vacationData = {
          ...newVacation,
          employee_id: parseInt(newVacation.employee_id)
        }
        await onCreateVacation(vacationData)
        setNewVacation({
          employee_id: '',
          data_inicio: '',
          data_fim: '',
          status: 'Planejado',
          observacoes: ''
        })
        setIsAddVacationOpen(false)
      } catch (error) {
        console.error('Erro ao adicionar férias:', error)
        alert('Erro ao adicionar férias. Tente novamente.')
      }
    }
  }

  const filteredCoordinations = coordinations.filter(coord => 
    coord.gerencia_id === parseInt(newEmployee.gerencia_id)
  )

  const filteredCoordinationsEdit = coordinations.filter(coord => 
    coord.gerencia_id === parseInt(editingEmployee?.gerencia_id || '')
  )

  return (
    <div className="space-y-6">
      {createdUserInfo && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
          <strong>Usuário criado!</strong><br />
          <span>Usuário: <b>{createdUserInfo.username}</b></span><br />
          <span>Email: <b>{createdUserInfo.email}</b></span><br />
          <span>Senha inicial: <b>{createdUserInfo.senha}</b></span><br />
          <button className="mt-2 text-blue-600 underline" onClick={() => setCreatedUserInfo(null)}>Fechar</button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Funcionários</h2>
          <p className="text-muted-foreground">Gerencie funcionários e suas férias</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Funcionário</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo funcionário
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={newEmployee.nome}
                      onChange={(e) => setNewEmployee({...newEmployee, nome: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Usuário (login)</Label>
                    <Input
                      id="username"
                      value={newEmployee.username}
                      onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                      placeholder="Usuário para login"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="E-mail do usuário"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha inicial</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                      placeholder="Senha inicial para o usuário"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gerencia">Gerência</Label>
                    <Select value={newEmployee.gerencia_id} onValueChange={(value) => setNewEmployee({...newEmployee, gerencia_id: value, coordenacao_id: ''})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a gerência" />
                      </SelectTrigger>
                      <SelectContent>
                        {managements.map(management => (
                          <SelectItem key={management.id} value={management.id.toString()}>
                            {management.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Grupo de Usuário</Label>
                    <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aprovador">Aprovador</SelectItem>
                        <SelectItem value="funcionario">Funcionário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coordenacao">Coordenação</Label>
                    <Select value={newEmployee.coordenacao_id} onValueChange={(value) => setNewEmployee({...newEmployee, coordenacao_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a coordenação" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCoordinations.map(coordination => (
                          <SelectItem key={coordination.id} value={coordination.id.toString()}>
                            {coordination.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={newEmployee.cargo}
                      onChange={(e) => setNewEmployee({...newEmployee, cargo: e.target.value})}
                      placeholder="Cargo do funcionário"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="data_admissao">Data de Admissão</Label>
                    <Input
                      id="data_admissao"
                      type="date"
                      value={newEmployee.data_admissao}
                      onChange={(e) => setNewEmployee({...newEmployee, data_admissao: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEmployee}>Adicionar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Dialog de Edição de Funcionário */}
          <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Funcionário</DialogTitle>
                <DialogDescription>
                  Atualize as informações do funcionário
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nome">Nome</Label>
                  <Input
                    id="edit-nome"
                    value={editingEmployee?.nome || ''}
                    onChange={(e) => setEditingEmployee({...editingEmployee, nome: e.target.value})}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-gerencia">Gerência</Label>
                  <Select value={editingEmployee?.gerencia_id || ''} onValueChange={(value) => setEditingEmployee({...editingEmployee, gerencia_id: value, coordenacao_id: ''})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a gerência" />
                    </SelectTrigger>
                    <SelectContent>
                      {managements.map(management => (
                        <SelectItem key={management.id} value={management.id.toString()}>
                          {management.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-coordenacao">Coordenação</Label>
                  <Select value={editingEmployee?.coordenacao_id || ''} onValueChange={(value) => setEditingEmployee({...editingEmployee, coordenacao_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a coordenação" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCoordinationsEdit.map(coordination => (
                        <SelectItem key={coordination.id} value={coordination.id.toString()}>
                          {coordination.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cargo">Cargo</Label>
                  <Input
                    id="edit-cargo"
                    value={editingEmployee?.cargo || ''}
                    onChange={(e) => setEditingEmployee({...editingEmployee, cargo: e.target.value})}
                    placeholder="Cargo do funcionário"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-data_admissao">Data de Admissão</Label>
                  <Input
                    id="edit-data_admissao"
                    type="date"
                    value={editingEmployee?.data_admissao || ''}
                    onChange={(e) => setEditingEmployee({...editingEmployee, data_admissao: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>Cancelar</Button>
                <Button onClick={handleUpdateEmployee}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddVacationOpen} onOpenChange={setIsAddVacationOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Nova Férias
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Férias</DialogTitle>
                <DialogDescription>
                  Registre um novo período de férias
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="employee">Funcionário</Label>
                  <Select value={newVacation.employee_id} onValueChange={(value) => setNewVacation({...newVacation, employee_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.nome} - {getCoordinationName(employee.coordenacao_id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="data_inicio">Data de Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={newVacation.data_inicio}
                      onChange={(e) => setNewVacation({...newVacation, data_inicio: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="data_fim">Data de Fim</Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={newVacation.data_fim}
                      onChange={(e) => setNewVacation({...newVacation, data_fim: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newVacation.status} onValueChange={(value) => setNewVacation({...newVacation, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planejado">Planejado</SelectItem>
                      <SelectItem value="Aprovado">Aprovado</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={newVacation.observacoes}
                    onChange={(e) => setNewVacation({...newVacation, observacoes: e.target.value})}
                    placeholder="Observações (opcional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddVacation}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
          <CardDescription>
            {employees.length} funcionários cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Gerência</TableHead>
                <TableHead>Coordenação</TableHead>
                <TableHead>Férias</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map(employee => {
                const employeeVacations = getEmployeeVacations(employee.id)
                const activeVacation = employeeVacations.find(v => {
                  const today = new Date()
                  const start = new Date(v.data_inicio)
                  const end = new Date(v.data_fim)
                  return start <= today && today <= end && v.status === 'Aprovado'
                })
                
                // Só admin pode editar/excluir qualquer funcionário
                // Gerente/Diretor/Coordenador podem aprovar férias dos subordinados
                // Analista só pode editar/incluir as próprias férias
                const canEdit = isAdmin || (isAnalista && user.id === employee.id)
                const canDelete = isAdmin
                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.nome}</TableCell>
                    <TableCell>{employee.cargo}</TableCell>
                    <TableCell>{getManagementName(employee.gerencia_id)}</TableCell>
                    <TableCell>{getCoordinationName(employee.coordenacao_id)}</TableCell>
                    <TableCell>{employeeVacations.length} registros</TableCell>
                    <TableCell>
                      {activeVacation ? (
                        <Badge variant="secondary">Em férias</Badge>
                      ) : (
                        <Badge variant="default">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o funcionário <strong>{employee.nome}</strong>? 
                                  Esta ação não pode ser desfeita e todas as férias associadas também serão removidas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Exibir férias apenas para o próprio funcionário, exceto admin/gerente/diretor/coordenador que podem ver férias de todos */}
      <div>
        <h3 className="text-xl font-semibold">Minhas Férias</h3>
        <Button variant="outline" onClick={() => setIsAddVacationOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Férias
        </Button>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead>Data de Fim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacations.filter(vacation => {
              if (isAdmin || isGerente || isDiretor || isCoordenador) {
                return true // Todos podem ver férias
              }
              return vacation.employee_id === user.id // Analista só vê as próprias férias
            }).map(vacation => (
              <TableRow key={vacation.id}>
                <TableCell>{employees.find(emp => emp.id === vacation.employee_id)?.nome}</TableCell>
                <TableCell>{new Date(vacation.data_inicio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(vacation.data_fim).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={vacation.status === 'Aprovado' ? 'secondary' : 'default'}>
                    {vacation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {(isAdmin || isGerente || isDiretor || isCoordenador) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewVacation({
                            employee_id: vacation.employee_id,
                            data_inicio: vacation.data_inicio,
                            data_fim: vacation.data_fim,
                            status: vacation.status,
                            observacoes: vacation.observacoes
                          })
                          setIsAddVacationOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este período de férias? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVacation(vacation.id)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default EmployeeManagement

