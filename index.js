/*===================
    Importaciones
===================*/

import express from "express";
const app = express(); // app es la instancia de la aplicación Express y contiene todos sus métodos.

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer la puerta
const PORT = environments.port;

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl, requireLogin } from "./src/api/middlewares/middlewares.js";

//Importamos las rutas de producto
import { productRoutes } from "./src/api/routes/index.js";
// import { productRoutes, viewRoutes, userRoutes} from "./src/api/routes/index.js";

// Importamos la configuración para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

import session from "express-session"; // Importamos session despues de instalar npm i express-session
const SESSION_KEY = environments.session_key;

// Importamos bcrypt
// import bcrypt from "bcrypt";


/*===================
    Middlewares
===================*/

app.use(cors());

// Middleware logger
app.use(loggerUrl); //Lo que hace es que por cada petición y cada respuesta devolver que tipo de operacion se hizo. funcion que consologuea todo el registro de la aip res

app.use(express.json()); // Midleware que convierte los datos "application/json" que nos proporciona la cabecera (header) de las solicitudes POST y PUT, los pasa de json a objetos JS. Recibe cuando estamos recibiendo informacion de un post y un put y los convierte en objeto javascript para en nuestro endpoint recibir eso como objetos, convierte el texto plano que recibimos en json a objetos javascript

// Middleware para parsear las solicitudes POST que enviamos desde el <form> HTML
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estaticos: construimos la ruta relativa para servir los archivos de la carpeta /public
app.use(express.static(join(__dirname, "src", "public"))) // Gracias a este middleware podemos servir los archivos de la carpeta public, como http://localhost:3000/img/prod1.jpg

/*=========================
    Sesiones en Express
===========================*/

// Middleware de sesion, cada vez que un usuario hace una solicitud HTTP, se gestionara su sesion mediante el middleware
app.use(session({
    secret: SESSION_KEY, // Firma las cookies para evitar manipulacion por el cliente, clave para la seguridad de la aplicaciones, este valor se usa para FIRMAR las cookies de sesion para que el servidor verifique que los datos no fueron alterados por el cliente
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));

app.use((req, res, next) => {
    res.locals.nombre = req.session?.nombreUsuario ?? null;
    next();
});

/*===================
    Configuracion
=====================*/
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src", "views")); //Le indicamos la ruta donde almacenamos las vistas en ejs


/*===================
    Endpoints
=====================*/

//Ahora las rutas las gestiona el middleware Router
app.use("/api/productos/", productRoutes);

//Devolvemos vistas
app.get("/", async (req, res) => {
    try {
        const [rows] = await connection.query("SELECT * FROM productos");
        
        // Le devolvemos la pagina index.ejs
        res.render("index", {
            title: "Index",
            about: "Lista de productos",
            products: rows
        }); 

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

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Login dashboard"
    });
});

app.get("/carrito", (req, res) => {
    res.render("carrito", {
        title: "Carrito",
        about: "Productos en el carrito"
    });
});


/*======================
    Rutas
======================*/


// //Rutas vista
// app.use("/", viewRoutes);

// //Rutas usuarios
// app.use("/api/usuarios", userRoutes);

app.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body; // Recibimos el email y el password

        // Optimizacion 1: Evitamos consulta innecesaria y le pasamos un mensaje de error a la vista
        if(!correo || !password) {
            return res.render("login", {
                title: "login",
                about: "Login dashboard",
                error: "Todos los campos son necesarios!"
            });
        }


        // Sentencia antes de bcrypt
        // const sql = `SELECT * FROM users where email = ? AND password = ?`;
        // const [rows] = await connection.query(sql, [email, password]);

        // Bcrypt I -> Sentencia con bcrypt, traemos solo el email
        const sql = "SELECT * FROM usuarios where correo = ? AND password = ?";
        const [rows] = await connection.query(sql, [correo, password]);


        // Si no recibimos nada, es porque no se encuentra un usuario con ese email o password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Login dashboard",
                error: "Error! Email o password no validos"
            });
        }

        console.log(rows); // [ { id: 7, name: 'test', email: 'test@test.com', password: 'test' } ]
        const user = rows[0]; // Guardamos el usuario en la variable user
        console.table(user);

        // Bcrypt II -> Comparamos el password hasheado (la contraseña del login hasheada es igual a la de la BBDD?)
        // const match = await bcrypt.compare(password, user.password); // Si ambos hashes coinciden, es porque coinciden las contraseñas y match devuelve true

        // console.log(match);

    //     if(match) {            
    //         // Guardamos la sesion
    //         req.session.user = {
    //             id: user.id,
    //             name: user.name,
    //             email: user.email
    //         }
    
    //         // Una vez guardada la sesion, vamos a redireccionar al dashboard
    //         res.redirect("/");

    //     } else {
    //         return res.render("login", {
    //             title: "Login",
    //             error: "Epa! Contraseña incorrecta"
    //         });
    //     }
         // Con el email y el password validos, guardamos la sesion
        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }

        res.redirect("/"); // Redirigimos a la pagina principal

    } catch (error) {
        console.log("Error en el login: ", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
     }
});


// Endpoint para /logout 
app.post("/logout", (req, res) => {
    // Destruimos la sesion
    req.session.destroy((err) => {
        // En caso de existir algun error, mandaremos una respuesta error
        if(err) {
            console.log("Error al destruir la sesion: ", err);

            return res.status(500).json({
                error: "Error al cerrar la sesion"
            });
        }

        res.redirect("/login");
    });
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`);
});

