<template>
  <div class="container py-4">
    <h2>Formulario - Vue (Vite)</h2>

    <!-- FORMULARIO -->
    <form @submit.prevent="submitForm" class="mb-4">
      <div class="row">
        <div class="col-md-3 mb-2">
          <label>DNI</label>
          <input v-model="form.dni" class="form-control" />
          <small v-if="errors.dni" class="text-danger">{{ errors.dni }}</small>
        </div>
        <div class="col-md-3 mb-2">
          <label>Nombres</label>
          <input v-model="form.nombres" class="form-control" />
          <small v-if="errors.nombres" class="text-danger">{{ errors.nombres }}</small>
        </div>
        <div class="col-md-3 mb-2">
          <label>Apellidos</label>
          <input v-model="form.apellidos" class="form-control" />
          <small v-if="errors.apellidos" class="text-danger">{{ errors.apellidos }}</small>
        </div>
        <div class="col-md-3 mb-2">
          <label>Fecha Nac.</label>
          <input v-model="form.fecha_nacimiento" type="date" class="form-control" />
          <small v-if="errors.fecha_nacimiento" class="text-danger">{{ errors.fecha_nacimiento }}</small>
        </div>
      </div>

      <div class="mt-2">
        <label>Género:</label>
        <div>
          <label class="me-2">
            <input type="radio" value="Masculino" v-model="form.genero" /> Masculino
          </label>
          <label class="me-2">
            <input type="radio" value="Femenino" v-model="form.genero" /> Femenino
          </label>
          <label>
            <input type="radio" value="Otro" v-model="form.genero" /> Otro
          </label>
        </div>
        <small v-if="errors.genero" class="text-danger">{{ errors.genero }}</small>
      </div>

      <div class="mt-2">
        <label>Ciudad:</label>
        <select v-model="form.ciudad" class="form-select w-25">
          <option value="">-- seleccionar --</option>
          <option>Quito</option>
          <option>Guayaquil</option>
          <option>Cuenca</option>
          <option>Otro</option>
        </select>
        <small v-if="errors.ciudad" class="text-danger">{{ errors.ciudad }}</small>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary me-2" type="submit">
          {{ editingId ? "Actualizar" : "Registrar" }}
        </button>
        <button type="button" class="btn btn-secondary" @click="resetForm">Limpiar</button>
      </div>
    </form>

    <!-- BUSCADOR -->
    <div class="mb-3">
      <input v-model="search" placeholder="Buscar por nombre o ciudad..." class="form-control w-50" />
    </div>

    <!-- TABLA -->
    <h3>Registros ({{ filteredUsers.length }})</h3>
    <table class="table table-sm table-bordered">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Ciudad</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, i) in filteredUsers" :key="u.id">
          <td>{{ i + 1 }}</td>
          <td>{{ u.dni }}</td>
          <td>{{ u.nombres }} {{ u.apellidos }}</td>
          <td>{{ u.ciudad }}</td>
          <td>{{ u.genero }}</td>
          <td>
            <button class="btn btn-sm btn-info me-2" @click="startEdit(u)">✏️ Editar</button>
            <button class="btn btn-sm btn-danger" @click="deleteUser(u.id)">🗑️ Eliminar</button>
          </td>
        </tr>
        <tr v-if="filteredUsers.length === 0">
          <td colspan="6" class="text-center">No hay registros</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const API = "http://localhost:3001/api/users";

const form = ref({
  dni: "",
  nombres: "",
  apellidos: "",
  fecha_nacimiento: "",
  genero: "",
  ciudad: "",
});

const users = ref([]);
const editingId = ref(null);
const errors = ref({});
const search = ref("");

// 🚀 Cargar usuarios
async function fetchUsers() {
  const res = await fetch(API);
  users.value = await res.json();
}
onMounted(fetchUsers);

// 🔄 Resetear formulario
function resetForm() {
  form.value = {
    dni: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    ciudad: "",
  };
  editingId.value = null;
  errors.value = {};
}

// ✅ Validar formulario
function validate() {
  const e = {};
  if (!form.value.dni || form.value.dni.length < 7) e.dni = "DNI inválido";
  if (!form.value.nombres) e.nombres = "Requerido";
  if (!form.value.apellidos) e.apellidos = "Requerido";
  if (!form.value.fecha_nacimiento) e.fecha_nacimiento = "Requerido";
  if (!form.value.genero) e.genero = "Seleccionar género";
  if (!form.value.ciudad) e.ciudad = "Seleccionar ciudad";
  errors.value = e;
  return Object.keys(e).length === 0;
}

// 📝 Registrar / Actualizar
async function submitForm() {
  if (!validate()) return;
  const method = editingId.value ? "PUT" : "POST";
  const url = editingId.value ? `${API}/${editingId.value}` : API;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form.value),
  });

  if (res.ok) {
    resetForm();
    fetchUsers();
  } else {
    alert("Error: " + JSON.stringify(await res.json()));
  }
}

// ✏️ Editar usuario
function startEdit(u) {
  form.value = {
    dni: u.dni,
    nombres: u.nombres,
    apellidos: u.apellidos,
    fecha_nacimiento: u.fecha_nacimiento,
    genero: u.genero,
    ciudad: u.ciudad,
  };
  editingId.value = u.id;
}

// ❌ Eliminar usuario
async function deleteUser(id) {
  if (!confirm("Confirmar eliminación")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchUsers();
}

// 🔎 Filtrado
const filteredUsers = computed(() =>
  users.value.filter(
    (u) =>
      u.nombres.toLowerCase().includes(search.value.toLowerCase()) ||
      u.apellidos.toLowerCase().includes(search.value.toLowerCase()) ||
      u.ciudad.toLowerCase().includes(search.value.toLowerCase())
  )
);
</script>