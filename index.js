/*===================
    Importaciones
===================*/

import express from "express";
const app = express(); // app es la instancia de la aplicación Express y contiene todos sus métodos.

import environments from "./src/api/config/environments.js"; // Traemos las variables de entorno para extraer la puerta
const PORT = environments.port;
const session_key = environments.session_key;

import cors from "cors"; // Importamos cors para poder usar sus metodos y permitir solicitudes de otras aplicaciones

// Importamos los middlewares
import { loggerUrl } from "./src/api/middlewares/middlewares.js";

//Importamos las rutas de producto
import { productRoutes, viewRoutes, userRoutes } from "./src/api/routes/index.js";
// import { productRoutes, viewRoutes, userRoutes} from "./src/api/routes/index.js";

// Importamos la configuración para trabajar con rutas y archivos estaticos
import { join, __dirname } from "./src/api/utils/index.js";
import connection from "./src/api/database/db.js";

import session from "express-session"; // Importamos session despues de instalar npm i express-session


// Importamos bcrypt
import bcrypt from "bcrypt";


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
    secret: session_key, // Firma las cookies para evitar manipulacion por el cliente, clave para la seguridad de la aplicaciones, este valor se usa para FIRMAR las cookies de sesion para que el servidor verifique que los datos no fueron alterados por el cliente
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));


/*===================
    Configuracion
=====================*/
app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); //Le indicamos la ruta donde almacenamos las vistas en ejs


/*===================
    Endpoints
=====================*/

// //Ahora las rutas las gestiona el middleware Router
app.use("/api/productos/", productRoutes);

app.use("/", viewRoutes);

// // //Rutas usuarios
app.use("/api/usuarios", userRoutes);

app.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body; // Recibimos el email y el password

        // Optimizacion 1: Evitamos consulta innecesaria y le pasamos un mensaje de error a la vista
        if(!correo || !password) {
            return res.render("login", {
                title: "login",                
                error: "Todos los campos son necesarios!"
            });
        }

        // Sentencia antes de bcrypt
        // const sql = `SELECT * FROM users where email = ? AND password = ?`;
        // const [rows] = await connection.query(sql, [email, password]);

        // Bcrypt I -> Sentencia con bcrypt, traemos solo el email
        const sql = "SELECT * FROM usuarios WHERE correo = ?";
        const [rows] = await connection.query(sql, [correo]);


        // Si no recibimos nada, es porque no se encuentra un usuario con ese email o password
        if(rows.length === 0) {
            return res.render("login", {
                title: "Login",               
                error: "Error! Email o password no validos"
            });
        }

        console.log(rows); // [ { id: 7, name: 'test', email: 'test@test.com', password: 'test' } ]
        const user = rows[0]; // Guardamos el usuario en la variable user
        console.table(user);

        // Bcrypt II -> Comparamos el password hasheado (la contraseña del login hasheada es igual a la de la BBDD?)
        const match = await bcrypt.compare(password, user.password); // Si ambos hashes coinciden, es porque coinciden las contraseñas y match devuelve true 

        console.log(match);

        if(match) {            
    //          // Con el email y el password validos, guardamos la sesion
            req.session.user = {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo
            }

            res.redirect("/"); // Redirigimos a la pagina principal


        } else {
            return res.render("login", {
                title: "Login",
                error: "Epa! Contraseña incorrecta"
            });
        }
        
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

//Endpoint para crear venta
app.post("/api/ventas", async (req, res) => {
    try {
        // Recibimos los datos del cuerpo de la peticion HTTP
        let { precio_total, nombre_usuario, productos } = req.body;

        // Validacion de datos obligatorios
        if(!precio_total || !nombre_usuario || !Array.isArray(productos)) {
            return res.status(400).json({
                message: "Datos invalidos, debes enviar date, total_price, user_name y products (array)"
            });
        }

        // 1. Insertar la venta en la tabla "sales"
        const sqlSale = "INSERT INTO ventas (precio_total, nombre_usuario) VALUES (?, ?)";
        const [saleResult] = await connection.query(sqlSale, [precio_total, nombre_usuario]);

        // 2. Obtenemos el id de la venta recien creada
        const saleId = saleResult.insertId;

        // 3. Insertamos los productos en "product_sales"
        const sqlProductSale = "INSERT INTO ventas_productos (venta_id, producto_id) VALUES (?, ?)";

        // Como tenemos una relacion N a N, debemos insertar una fila por cada producto vendido
        for (const productId of productos) {
            await connection.query(sqlProductSale, [saleId, productId]);
        }

        // Respuesta de exito
        res.status(201).json({
            message: "Venta registrada con exito!"
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        })
    }
})




app.listen(PORT, () => {
    console.log(`Servidor corriendo desde el puerto ${PORT}`);
});

