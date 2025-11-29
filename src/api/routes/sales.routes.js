import { Router } from "express";
import connection from "../database/db.js";
import { validateId } from "../middlewares/middlewares.js";

const router = Router();

router.get("/", async (req, res) =>{
    
   try {

        const sql = "SELECT * FROM ventas";

        const [rows] = await connection.query(sql);

        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        })

   } catch (error) {
        console.error("Error obteniendo ventas", error.message);

        res.status(500).json({
            message: "Error interno al obtener ventas"
        });
   }
});

router.get("/:id", validateId , async (req, res) => {
    try{
        let { id } = req.params;

        let sql = "SELECT * FROM ventas WHERE ventas.id = ?";

        const [rows] = await connection.query(sql, [id]);
        if(rows.length === 0) {
            console.log(`Error, no existe venta con el id: ${id}`);

            return res.status(404).json({
                message: `No se encontro venta con id: ${id}`
            });
        }

        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo producto por id", error);
        
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        let {nombre_usuario, productos} = req.body;
        
        if(!nombre_usuario || !Array.isArray(productos) || !productos) {
            return res.status(400).json({
                message: "debe llenar todos los campos"
            });
        }

        let total = productos.reduce((accum, producto) => {return accum + producto.precio * producto.cantidad}, 0);        

        let sql = "INSERT INTO ventas (nombre_usuario, total) VALUES (?, ?)";

        const [result] = await connection.query(sql, [nombre_usuario, total]);
        const venta_id = result.insertId;
        console.log(result);        

        let ventaProductoSql = "INSERT INTO ventas_productos (venta_id, producto_id, precio, cantidad) VALUES (?, ?, ?, ?)";
        

        for(const producto of productos) {
            const {producto_id, precio, cantidad} = producto;           

            const ventaProducto = [venta_id, producto_id, precio, cantidad];          
            
            const [result] = await connection.query(ventaProductoSql, ventaProducto);
            console.log(result);
        }        

        res.status(201).json({
            message: "Todo resultó correctamente"
        });
        

    } catch (error) {
        console.log("Error al crear", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
});

// router.put();

// router.delete();


export default router;