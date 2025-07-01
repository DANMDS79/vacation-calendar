import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Hook personalizado para fazer requisições à API
export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setLoading(false)
      return data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  return { request, loading, error }
}

// Hook para gerenciar dados das gerências
export function useManagements() {
  const [managements, setManagements] = useState([])
  const { request, loading, error } = useApi()

  const fetchManagements = async () => {
    try {
      const data = await request('/managements')
      setManagements(data)
    } catch (err) {
      console.error('Erro ao buscar gerências:', err)
    }
  }

  useEffect(() => {
    fetchManagements()
  }, [])

  return { managements, loading, error, refetch: fetchManagements }
}

// Hook para gerenciar dados das coordenações
export function useCoordinations() {
  const [coordinations, setCoordinations] = useState([])
  const { request, loading, error } = useApi()

  const fetchCoordinations = async () => {
    try {
      const data = await request('/coordinations')
      setCoordinations(data)
    } catch (err) {
      console.error('Erro ao buscar coordenações:', err)
    }
  }

  useEffect(() => {
    fetchCoordinations()
  }, [])

  return { coordinations, loading, error, refetch: fetchCoordinations }
}

// Hook para gerenciar dados dos funcionários
export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const { request, loading, error } = useApi()

  const fetchEmployees = async () => {
    try {
      const data = await request('/employees')
      setEmployees(data)
    } catch (err) {
      console.error('Erro ao buscar funcionários:', err)
    }
  }

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await request('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      })
      setEmployees(prev => [...prev, newEmployee])
      return newEmployee
    } catch (err) {
      console.error('Erro ao criar funcionário:', err)
      throw err
    }
  }

  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData),
      })
      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp))
      return updatedEmployee
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err)
      throw err
    }
  }

  const deleteEmployee = async (id) => {
    try {
      await request(`/employees/${id}`, {
        method: 'DELETE',
      })
      setEmployees(prev => prev.filter(emp => emp.id !== id))
    } catch (err) {
      console.error('Erro ao deletar funcionário:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return { 
    employees, 
    loading, 
    error, 
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}

// Hook para gerenciar dados das férias
export function useVacations() {
  const [vacations, setVacations] = useState([])
  const { request, loading, error } = useApi()

  const fetchVacations = async () => {
    try {
      const data = await request('/vacations/details')
      setVacations(data)
    } catch (err) {
      console.error('Erro ao buscar férias:', err)
    }
  }

  const createVacation = async (vacationData) => {
    try {
      const newVacation = await request('/vacations', {
        method: 'POST',
        body: JSON.stringify(vacationData),
      })
      await fetchVacations() // Recarregar para pegar os detalhes completos
      return newVacation
    } catch (err) {
      console.error('Erro ao criar férias:', err)
      throw err
    }
  }

  const updateVacation = async (id, vacationData) => {
    try {
      const updatedVacation = await request(`/vacations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(vacationData),
      })
      await fetchVacations() // Recarregar para pegar os detalhes completos
      return updatedVacation
    } catch (err) {
      console.error('Erro ao atualizar férias:', err)
      throw err
    }
  }

  const deleteVacation = async (id) => {
    try {
      await request(`/vacations/${id}`, {
        method: 'DELETE',
      })
      setVacations(prev => prev.filter(vac => vac.id !== id))
    } catch (err) {
      console.error('Erro ao deletar férias:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [])

  return { 
    vacations, 
    loading, 
    error, 
    refetch: fetchVacations,
    createVacation,
    updateVacation,
    deleteVacation
  }
}

// Hook para gerenciar conflitos
export function useConflicts() {
  const [conflicts, setConflicts] = useState({
    summary: null,
    overlaps: [],
    coverage: [],
    criticalPeriods: []
  })
  const { request, loading, error } = useApi()

  const fetchConflicts = async () => {
    try {
      const [summary, overlaps, coverage, criticalPeriods] = await Promise.all([
        request('/conflicts/summary'),
        request('/conflicts/overlaps'),
        request('/conflicts/coverage'),
        request('/conflicts/critical-periods')
      ])
      
      setConflicts({
        summary,
        overlaps,
        coverage,
        criticalPeriods
      })
    } catch (err) {
      console.error('Erro ao buscar conflitos:', err)
    }
  }

  useEffect(() => {
    fetchConflicts()
  }, [])

  return { conflicts, loading, error, refetch: fetchConflicts }
}

