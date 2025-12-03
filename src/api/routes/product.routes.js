/*=======================================================================================
    product.routes.js:
    - Este archivo define todas las rutas de API relacionadas con los productos y conecta cada ruta con su controlador correspondiente.
    - Organiza y centraliza los endpoints del módulo “productos”.
👉 - Indica qué controlador debe ejecutarse para cada ruta HTTP.
👉 - Aplica middlewares específicos como validateId.

    Es parte del patrón MVC, donde este archivo es la R de Routes.
=========================================================================================*/


import { Router } from "express";
const router = Router();

import { validateId } from "../middlewares/middlewares.js";

import { createProduct, getAllProducts, getProductoById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";

// GET all products -> Traer todos los productos
router.get("/", getAllProducts);

// GET product by id -> Consultar producto por id
router.get("/:id", validateId,  getProductoById);

// POST -> Crear nuevo producto
router.post("/", createProduct);

// PUT -> Actualizar producto
router.put("/", modifyProduct);

// DELETE => Eliminar producto
router.delete("/:id", validateId, removeProduct);

// Exportamos todas las rutas

export default router;