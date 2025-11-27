/*===================
    Importaciones
===================*/

import express from "express";
const app = express(); // app es la instancia de la aplicación Express y contiene todos sus métodos.

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer la puerta
const PORT = environments.port;

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl } from "./src/api/middlewares/middlewares.js";

//Importamos las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";

// Importamos la configuración para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

/*===================
    Middlewares
===================*/

app.use(cors());

// Middleware logger
app.use(loggerUrl); //Lo que hace es que por cada petición y cada respuesta devolver que tipo de operacion se hizo. funcion que consologuea todo el registro de la aip res


app.use(express.json()); // Midleware que convierte los datos "application/json" que nos proporciona la cabecera (header) de las solicitudes POST y PUT, los pasa de json a objetos JS. Recibe cuando estamos recibiendo informacion de un post y un put y los convierte en objeto javascript para en nuestro endpoint recibir eso como objetos, convierte el texto plano que recibimos en json a objetos javascript

// Middleware para servir archivos estaticos: construimos la ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public"))) // Gracias a este middleware podemos servir los archivos de la carpeta public, como http://localhost:3000/img/prod1.jpg


/*===================
    Configuracion
=====================*/
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src", "views")); //Le indicamos la ruta donde almacenamos las vistas en ejs

app.get("/", (req, res) => {
    // Tipo de respuesta en texto plano
    res.send("TP Integrador");
});

// Devolveremos vistas 
app.get("/index", async (req, res) => {
    try {

        const [rows] = await connection.query("SELECT * FROM productos");
        
        res.render("index",{
            title: "Indice",
            about: "Listado productos",
            products: rows
        });  // Le devolvemos la pagina index.ejs

    } catch (error) {
        console.log(error);
    }

    
});

app.get("/consultar", (req, res) => {
    res.render("consultar", {
        title: "Consultar",
        about: "Consultar producto por id:",
    });
});

app.get("/crear", (req, res) => {
    res.render("crear", {
        title: "Crear",
        about: "Crear producto",
    });
});

app.get("/modificar", (req, res) => {
    res.render("modificar", {
        title: "Modificar",
        about: "Actualizar producto",
    });
});

app.get("/eliminar", (req, res) => {
    res.render("eliminar", {
        title: "Eliminar",
        about: "Eliminar producto",
    });
});

//Ahora las rutas las gestiona el middleware Router
app.use("/api/productos/", productRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`);
});

