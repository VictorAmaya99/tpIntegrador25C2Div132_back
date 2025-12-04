/* 
    Este archivo se encarga de cargar y centralizar todas las variables de configuración del proyecto —como el puerto, la información de la base de datos y la clave de sesión— usando dotenv.

    Este archivo carga el .env y centraliza en un objeto toda la configuración del proyecto (puerto, base de datos y claves). Así el resto del proyecto puede usar esos valores sin exponer información sensible.
*/


import dotenv from "dotenv"; // Importa la librería dotenv, que permite leer las variables que tenés en el archivo .env.

dotenv.config(); // Carga automáticamente las variables del archivo .env en process.env.

export default {
    port: process.env.PORT,    
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD        
    },
    session_key: process.env.SESSION_KEY,
}
