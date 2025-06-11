import { URL } from "./Config.js";

export default async function getById(endpoint, id, token) {
  try {
    // Eliminar slash final de URL y slash inicial de endpoint
    const cleanURL = URL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');

    const res = await fetch(`${cleanURL}/${cleanEndpoint}/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });

    if (!res.ok) {
      throw new Error(`Error al obtener por ID: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error en getById:", err);
    return null;
  }
}
