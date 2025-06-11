import { URL } from "./Config.js";

const eliminarDato = async (endpoint, id, token) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
        });
        
        // Manejar la respuesta
        if (respuesta.ok) {
            console.log(`Dato con ID ${id} eliminado exitosamente`);
            return true;
        } else {
            const errorData = await respuesta.json();
            console.error("Error en la eliminación:", errorData);
            return false;
        }
    } catch (error) {
        console.error("Error al eliminar el dato:", error);
        return false;
    }
};

export default eliminarDato ;