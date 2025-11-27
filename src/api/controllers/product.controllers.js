// Traemos el modelo del producto con un nombre 

import ProductModel from "../models/product.models.js";

// GET all products -> Traer todos los productos
export const getAllProducts = async (req, res) => {
    try {                      
        const [rows, fields] = await ProductModel.selectAllProducts();
        
        // Tipo de respuesta en JSON
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"

        });

    } catch(error) {
        console.error("Error obteniendo productos", error.message);
        
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}

// GET product by id -> Consultar producto por id
export const getProductoById = async (req, res) => {    
    try {
        
        let { id } = req.params;
        
        const [rows] = await ProductModel.selectProductById(id);        
        
        // Optimización 3: Comprobamos que exista el producto con ese id
        if(rows.length === 0) {
            // Este console se muestra en la consola de nuestro servidor
            console.log(`Error!! No existe producto con el id ${id}`);
            
            // return es CLAVE, porque aca se termina ejecución del código.
            return res.status(404).json({
                message: `No se encontró producto con id ${id}`
            });
        }

        res.status(200).json({
            payload: rows
        });
        

    } catch(error) {
        console.log("Error obteniendo producto por id", error);
        
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}

// POST -> Crear nuevo producto
export const createProduct = async (req, res) => {
    try {
        // Extraemos e imprimimos los datos del body para ver si llegan correctamente
        // name, image, category, price
        let { nombre, imagen, tipo, precio } = req.body;
        console.log(req.body);
        console.log(`Nombre producto: ${nombre}`);

        //Optimización 1: Validación de datos de entrada
        if(!tipo || !imagen || !nombre || !precio) {
            return res.status(400).json({
                message: "Datos invalidos asegurate de enviar todos los campos"
            });
        }

        let [rows] = await ProductModel.insertProduct(nombre, imagen, tipo, precio);        

         // Devolvemos una repuesta con codigo 201 Created
         res.status(201).json({
            message: "Producto creado con exito",

         });

    } catch(error) {
        console.log("Error al crear producto: ", error);
        
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}

// PUT -> Actualizar producto
export const modifyProduct = async (req, res) => {
    try {                       
            let {id, nombre, precio, tipo, imagen, activo} = req.body;

            // Optimización 1: Validación básica de todos los campos recibidos en el body

            if(!id || !nombre || !precio || !tipo || !imagen || !activo) {
                return res.status(400).json({
                    message: "Faltan campos requeridos"
                });
            }

            let [result] = await ProductModel.updateProduct(nombre, precio, tipo, imagen, activo, id);// Estos valores en orden reemplazan a los placeholders.

            console.log(result);
            
            // Optimización 2: Comprobamos que haya filas afectadas -> testeamos que se actualizara 
            if(result.affectedRows === 0 ) { //Si no se actualiza nada
                 return res.status(400).json({
                    message:"No se actualizó el producto"
                 });
            }
            
            res.status(200).json({
                message: `Producto con id: ${id} actualizado correctamente`
            });

    } catch(error) {
        //Veremos el error en la consola del servidor 
        console.error("Error al actualizar producto: ", error);

        //Le responderemos al cliente con un código 500 y un mensaje de error
        res.status(500).json({
            message: `Error interno del servidor: ${error}` 
        });
    }
}

// DELETE => Eliminar producto
export const removeProduct = async (req, res) => {
    try {

        let { id } = req.params;
        
        let [result] = await ProductModel.deleteProduct(id);
        
        // Comprobamos si realmente se eliminó el producto
        if(result.affectedRows === 0) {
            return res.status(400).json({
                message: `No se eliminó el producto con id: ${id}`
            });
        }

        return res.status(200).json({
            message: `Producto con id: ${id} eliminado correctamente`
        });
        

    } catch(error) {
        console.error("Error al eliminar un producto por su id", error);

        res.status(500).json({
            message: `Error al eliminar producto con id: ${id}`,
            error: error.message
        });
    }
}

