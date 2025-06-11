import { URL } from "./Config.js";

// POST sin token
export const agregarDato = async (endpoint, bodyData) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });

        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error("Error al agregar dato:", error);
        return { error: true, mensaje: error.message };
    }
};

// POST con token
export const agregarDatoToken = async (endpoint, bodyData, token) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error("Error al agregar dato con token:", error);
        return { error: true, mensaje: error.message };
    }
};
