/*==================================================
    Controladores usuarios}

    - Este controlador se encarga de registrar un nuevo usuario en la base de datos.
====================================================*/


import bcrypt from "bcrypt";
import UserModels from "../models/user.models.js";

export const insertUser = async (req, res) => {
    try {
        
        //Recibe los datos del formulario, extrae los datos 
        const { nombre, correo, password } = req.body;

        // Valida que todos los campos esten completos, si falta alguno responde con error 400 (bad request)
        if(!nombre || !correo || !password) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los datos del formulario"
            });
        }

        //Hashea y encripta la contraseña 
        //Setup de bcrypt
        const saltRounds = 10; // nivel de seguridad
        const hashedPassword = await bcrypt.hash(password, saltRounds); // convierte la contraseña en un hash irreconocible
        // No guarda contraseñas en texto plano

        // Guard al usuario en la base de datos, pero envia la contraseña hasheada no la original
        const [rows] = await UserModels.insertUser(nombre, correo, hashedPassword);
        
        // Si todo salió bien devuelve una respuesta 
        res.status(201).json({
            message: "Usuario creado con exito",
            usuarioId: rows.insertId
        });

    // Manejo de errores. Si algo falla muestra un error en consola
    }catch (error){
        console.log("Error interno del servidor", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}