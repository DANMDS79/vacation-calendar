import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:10000/api";

function useApi() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/employees`);
      if (!res.ok) throw new Error("Erro ao buscar funcionários");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employee) => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      if (!res.ok) {
        const errData = await res.json();
        return { error: errData.message || "Erro ao adicionar funcionário" };
      }
      await fetchEmployees();
      return {};
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    }
  };

  return {
    employees,
    addEmployee,
    error,
    refetch: fetchEmployees,
  };
}

export default useApi;
