import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";

function EmployeeManagement() {
  const { employees, addEmployee, error, refetch } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.email) {
      setFormError("Preencha todos os campos.");
      return;
    }
    const result = await addEmployee(form);
    if (result && result.error) {
      setFormError(result.error);
    } else {
      setShowModal(false);
      setForm({ name: "", email: "" });
      refetch();
    }
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Adicionar Funcionário
      </button>
      <ul className="bg-white rounded shadow p-4">
        {employees && employees.length > 0 ? (
          employees.map((emp) => (
            <li key={emp.id} className="border-b py-2 last:border-b-0">
              {emp.name} ({emp.email})
            </li>
          ))
        ) : (
          <li>Nenhum funcionário cadastrado.</li>
        )}
      </ul>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-2 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Adicionar Funcionário</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                placeholder="Nome"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
              {formError && <div className="text-red-600 text-sm">{formError}</div>}
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}

export default EmployeeManagement;
