// Importamos el middleware Router
import { Router } from "express";
import { insertUser } from "../controllers/user.controllers.js";
const router = Router();

// console.log("Cargando controlador...");

// export const insertUser = () => {
//     console.log("Insert user ejecutado");
// };


// import { productsView} from "../controllers/view.controlers.js";

router.post("/", insertUser);

export default router;