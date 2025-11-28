// Importamos el middleware requireLogin
import { Router } from "express";
import { requireLogin } from "../middlewares/middlewares.js";
import { productsView } from "../controllers/view.controllers.js";
const router = Router();

router.get("/", requireLogin, productsView);

router.get("/consultar", requireLogin, (req, res) => {

    /* Para no tener que repetir todo esto, exportamos esta logica al middleware requireLogin
    if(!req.session.user) {
        return res.redirect("/login");
    }
    */
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id"
    });
});


router.get("/crear", requireLogin, (req, res) => {

    res.render("crear", {
        title: "Crear",
        about: "Crear producto"
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

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    });
});

export default router;
