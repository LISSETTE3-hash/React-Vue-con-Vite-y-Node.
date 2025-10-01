// src/App.jsx
import React, { useEffect, useState } from 'react';

const API = 'http://localhost:3001/api/users';

export default function App() {
  const [form, setForm] = useState({
    dni: '', nombres: '', apellidos: '', fecha_nacimiento: '', genero: '', ciudad: ''
  });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ✅ Validaciones mejoradas
  function validate() {
    const e = {};
    if (!/^\d{7,10}$/.test(form.dni)) e.dni = 'DNI inválido (7-10 dígitos numéricos)';
    if (!form.nombres.trim()) e.nombres = 'Nombres requeridos';
    if (!form.apellidos.trim()) e.apellidos = 'Apellidos requeridos';
    if (!form.fecha_nacimiento) e.fecha_nacimiento = 'Fecha requerida';
    if (!form.genero) e.genero = 'Seleccionar género';
    if (!form.ciudad) e.ciudad = 'Seleccionar ciudad';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ dni: '', nombres: '', apellidos: '', fecha_nacimiento: '', genero: '', ciudad: '' });
        setEditingId(null);
        setErrors({});
        fetchUsers();
      } else {
        const err = await res.json();
        alert("Error en el servidor: " + JSON.stringify(err));
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudo conectar con el servidor");
    }
  }

  function startEdit(u) {
    setForm({
      dni: u.dni,
      nombres: u.nombres,
      apellidos: u.apellidos,
      fecha_nacimiento: u.fecha_nacimiento,
      genero: u.genero,
      ciudad: u.ciudad
    });
    setEditingId(u.id);
  }

  // ✅ Eliminar con confirmación y manejo de errores
  async function handleDelete(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al conectar con el servidor");
    }
  }

  // 🔎 Filtrado de usuarios por nombre/apellido/ciudad
  const filteredUsers = users.filter(u =>
    u.nombres.toLowerCase().includes(search.toLowerCase()) ||
    u.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    u.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2>Formulario - React</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-2">
            <label>DNI</label>
            <input name="dni" value={form.dni} onChange={handleChange} className="form-control" />
            {errors.dni && <small className="text-danger">{errors.dni}</small>}
          </div>
          <div className="col-md-3 mb-2">
            <label>Nombres</label>
            <input name="nombres" value={form.nombres} onChange={handleChange} className="form-control" />
            {errors.nombres && <small className="text-danger">{errors.nombres}</small>}
          </div>
          <div className="col-md-3 mb-2">
            <label>Apellidos</label>
            <input name="apellidos" value={form.apellidos} onChange={handleChange} className="form-control" />
            {errors.apellidos && <small className="text-danger">{errors.apellidos}</small>}
          </div>
          <div className="col-md-3 mb-2">
            <label>Fecha Nac.</label>
            <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} type="date" className="form-control" />
            {errors.fecha_nacimiento && <small className="text-danger">{errors.fecha_nacimiento}</small>}
          </div>
        </div>

        <div className="mt-2">
          <label>Género:</label>
          <div>
            <label className="me-2">
              <input type="radio" name="genero" value="Masculino"
                checked={form.genero === 'Masculino'} onChange={handleChange} /> Masculino
            </label>
            <label className="me-2">
              <input type="radio" name="genero" value="Femenino"
                checked={form.genero === 'Femenino'} onChange={handleChange} /> Femenino
            </label>
            <label>
              <input type="radio" name="genero" value="Otro"
                checked={form.genero === 'Otro'} onChange={handleChange} /> Otro
            </label>
          </div>
          {errors.genero && <small className="text-danger">{errors.genero}</small>}
        </div>

        <div className="mt-2">
          <label>Ciudad:</label>
          <select name="ciudad" value={form.ciudad} onChange={handleChange} className="form-select w-25">
            <option value="">-- seleccionar --</option>
            <option>Quito</option>
            <option>Guayaquil</option>
            <option>Cuenca</option>
            <option>Otro</option>
          </select>
          {errors.ciudad && <small className="text-danger">{errors.ciudad}</small>}
        </div>

        <div className="mt-3">
          <button className="btn btn-primary me-2" type="submit">
            {editingId ? 'Actualizar' : 'Registrar'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setForm({ dni: '', nombres: '', apellidos: '', fecha_nacimiento: '', genero: '', ciudad: '' });
              setEditingId(null);
              setErrors({});
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* 🔎 Buscador */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar por nombre o ciudad..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📊 Contador de registros */}
      <h3>Registros ({filteredUsers.length})</h3>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>#</th><th>DNI</th><th>Nombre</th><th>Ciudad</th><th>Género</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.dni}</td>
              <td>{u.nombres} {u.apellidos}</td>
              <td>{u.ciudad}</td>
              <td>{u.genero}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => startEdit(u)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr><td colSpan="6" className="text-center">No hay registros</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}