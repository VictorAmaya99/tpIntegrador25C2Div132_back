// Middleware logger que muestra por consola todas las solicitudes
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);    
    next();
}

// Midleware de ruta para validar el id en la ruta /api/productos/:id
const validateId = (req, res, next) => {
    const { id } = req.params;

    // Validar que el Id sea un número (de lo contrario la consulta podría generar un error en la base de datos)
    if(!id || isNaN(id)) {
        return res.status(400).json({
            message: "El id debe ser un número"            
        });
    }

    // Convertimos el parámetro id (originalmente un string porque viene de una url) a un número entero (integer en base a 10 decimales)
    req.id = parseInt(id, 10); // Convertimos el id en un entero

    console.log("Id validado!: ", req.id);

    next(); // Continuar al siguiente middleware (si lo hay) o con la respuesta
    
}

// Middleware de ruta, para proteger las vistas si no se hizo login
const requireLogin = (req, res, next) => {
   
    if(!req.session.user) {
        return res.redirect("/login");
    }

    next(); // Sin next, la peticion nunca llega a la respuesta (res)
}


export {
    loggerUrl,
    validateId,
    requireLogin
}

