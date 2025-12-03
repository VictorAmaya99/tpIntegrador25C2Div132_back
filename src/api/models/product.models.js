/*===================================================
    Es parte del modelo MVC:
    - Se encarga de hablar directamente con la base de datos.
    - Ejecuta las consultas SQL.
    - Solo ejecuta consultas y devuelve resultados
=====================================================*/

import connection from "../database/db.js";

//Traer todos los productos 

const selectAllProducts = () => {

    const sql = "SELECT * FROM productos";

    return connection.query(sql);
}

// Traer producto por id
const selectProductById = (id) => {
    let sql = "SELECT * FROM productos WHERE productos.id = ?";

    return connection.query(sql, [id]);
}

// Crear nuevo producto
const insertProduct = (nombre, imagen, tipo, precio) => {
    let sql = "INSERT INTO productos(nombre, imagen, tipo, precio) VALUES (?, ?, ?, ?)";

    return connection.query(sql, [nombre, imagen, tipo, precio]);  
}

// Modificar producto
const updateProduct = (nombre, precio, tipo, imagen, activo, id) => {
     let sql = `
                UPDATE productos 
                SET nombre = ?, precio = ?, tipo = ?, imagen = ?, activo = ?
                WHERE id = ?
            `;

    return connection.query(sql, [nombre, precio, tipo, imagen, activo, id]);// Estos valores en orden reemplazan a los placeholders.
}

// Eliminar producto
const deleteProduct = (id) => {
    // Opcion 1: Hacer el borrado normal
    let sql = `DELETE FROM productos WHERE id = ?`;

    // Opcion 2: Baja lógica 
    let sql2 = `UPDATE productos SET activo = 0 WHERE id = ?`;
        
    return connection.query(sql, [id]);
}

export default {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct
} 

