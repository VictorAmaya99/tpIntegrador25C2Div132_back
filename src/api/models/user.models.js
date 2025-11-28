// models/user.models.js///////////////////////////////////////
import connection from "../database/db.js";

// Crear usuario
const insertUser = (nombre, correo, password) => {
    const sql = `INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)`;
    return connection.query(sql, [nombre, correo, password]);
}

export default {
    insertUser
}

