
/*=====================================================================
    Este es el modelo de usuarios dentro del patron MVC:
    - Habla directamente con la base de datos.
    - Ejecuta consultas SQL relacionadas con usuarios.
    - Se encarga solo de enviar consulta SQL para crear usuarios
    - devuelve el resultado al controlador.
=======================================================================*/

import connection from "../database/db.js";

// Crear usuario
const insertUser = (nombre, correo, password) => {
    const sql = `INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)`;
    return connection.query(sql, [nombre, correo, password]);
}

export default {
    insertUser
}

