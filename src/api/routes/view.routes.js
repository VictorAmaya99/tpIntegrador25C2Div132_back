/*==============================================================================

    view.route.js:
    - Este archivo define todas las rutas que muestran vistas (páginas) en tu aplicación, usando EJS como motor de plantillas.
    - Cuando el usuario ingresa a una URL, Express debe renderizar una vista EJS.
    - Algunas vistas requieren estar logueado, por eso se usa el middleware requireLogin.

    - Este archivo maneja todas las rutas que muestran vistas EJS y protege la mayoría de ellas usando el middleware de login.

================================================================================*/

// Importamos el middleware requireLogin
import { Router } from "express";
import { requireLogin } from "../middlewares/middlewares.js";
import { productsView } from "../controllers/view.controllers.js";
const router = Router();

router.get("/", requireLogin, productsView);

router.get("/consultar", requireLogin, (req, res) => {

    //  if(!req.session.user) {
    //     return res.redirect("/login")
    // }

    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id"
    });
});


router.get("/crear", requireLogin, (req, res) => {

    res.render("crear", {
        title: "Crear",
        about: "Crear"
    });
});

router.get("/modificar", requireLogin, (req, res) => {

    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto"
    })
});

router.get("/eliminar", requireLogin, (req, res) => {

    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto"
    })
});

//Vista del login
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});



export default router;
