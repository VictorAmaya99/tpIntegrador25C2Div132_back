/*=================================================
    Controlador de vistas
    - Pide los productos al modelo
 ==================================================*/

// Importa el modulo del modelo de productos
import productModels from "../models/product.models.js";


export const productsView = async (req, res) => {
      
    try {
        // Llama al metodo SelectAllProducts() y espera el resultado
        const [rows] = await productModels.selectAllProducts();
        // Se usa el destructuring rows contiene el array de productos obtenida desde la base de datos
        // await se para trabajar con el resultado de la consulta de forma secuencial, sin callbacks.

        // Se renderiza la vista y se le pasa un objeto con datos, 
        res.render("index", {
            title: "Inicio", //valor para mostrar como titulo de la pagina
            about: "Listado principal", //Texto descriptivo / subtitulo
            productos: rows //La lista de productos
        })

    } catch (error) {
        console.error(error);
    }
}