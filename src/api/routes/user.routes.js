/*============================================================================
    user.routes.js:
    - Este archivo centraliza y organiza las rutas del módulo “usuarios”, y define que para la ruta POST de creación de usuarios se ejecute el controlador correspondiente (insertUser).
==============================================================================*/


// Importamos el middleware Router
import { Router } from "express";
import { insertUser } from "../controllers/user.controllers.js";
const router = Router();

router.post("/", insertUser);

export default router;