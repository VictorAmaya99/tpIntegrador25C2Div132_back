/*===========================================================
    Usando archivo db.js:
    - Este archivo crea una conexión reutilizable a MySQL usando datos del .env.
    - La exporta para que el resto del proyecto pueda hacer consultas.
*/

// Importamos la libreria mysql2 con promesas
import mysql from "mysql2/promise"; 

// Importamos la configuracion del entorno
import environments from "../config/environments.js";

// extrae solo la parte database
const { database } = environments;

// crea un pool de conexiones
const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

// exporta la conexion
export default connection;