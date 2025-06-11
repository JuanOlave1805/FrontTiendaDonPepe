# 🛍️ FrontTiendaDonPepe

**FrontTiendaDonPepe** es una interfaz web desarrollada con **HTML**, **CSS**, **JavaScript** y la librería de estilos **Bootstrap 5**. Este frontend consume la API de la tienda de Don Pepe, permitiendo la visualización, gestión y navegación de productos, usuarios, pedidos, entre otros recursos.

---

## 🌐 Tecnologías Utilizadas

- HTML5  
- CSS3  
- JavaScript (Vanilla)  
- Bootstrap 5  

---

## ⚙️ Requisitos Previos

Para ejecutar este proyecto necesitas:

- Un navegador web moderno (Chrome, Firefox, Edge, etc.)  
- Tener la API **ApiTiendaDonPepe** corriendo correctamente en local o en un servidor  

---

## 🚀 Pasos para la Ejecución del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/FrontTiendaDonPepe.git
   ```

2. **Abrir el proyecto**
   - Abre la carpeta clonada con tu editor de código favorito (por ejemplo, Visual Studio Code).
   - O simplemente abre el archivo `index.html` con tu navegador.

3. **Configurar la conexión a la API**

   > Nota: Ejecuta el backend almacenado en el repositorio  
   > [https://github.com/JuanOlave1805/ApiTiendaDonPepe.git](https://github.com/JuanOlave1805/ApiTiendaDonPepe.git)  
   >  
   > **Credenciales:**  
   > Usuario: `admin`  
   > Contraseña: `12345`

   En los archivos JS donde se realiza el `fetch`, asegúrate de apuntar a la URL correcta de la API:
   ```js
   const API_URL = "https://localhost:7253/api"; // Cambia según tu entorno
   ```

---

## 🧪 Funcionalidades

- Autenticación mediante formulario de login con JWT  
- Visualización de productos en tabla y tarjetas (responsive)  
- Gestión de categorías, proveedores y órdenes  
- Modales para crear, editar y eliminar registros  
- Adaptado para pantallas móviles mediante Bootstrap  

---

## ✍️ Autor

Desarrollado por **Juan Olave**  
📧 Contacto: [olavejuan1805@gmail.com](mailto:olavejuan1805@gmail.com)
