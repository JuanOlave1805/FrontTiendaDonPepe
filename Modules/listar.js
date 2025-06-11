import { URL } from "./Config.js";

const solicitud = async (endpoint, token) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return error;
    }
};

export default solicitud;
