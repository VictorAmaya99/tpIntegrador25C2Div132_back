import bcrypt from "bcrypt";
import UserModels from "../models/user.models.js";

export const insertUser = async (req, res) => {
    try {
        
        const { nombre, correo, password } = req.body;

        if(!nombre || !correo || !password) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de enviar todos los datos del formulario"
            });
        }

        //Setup de bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Antes de hashear
        // const [rows] = await UserModels.insertUser(nombre, correo, password);

        //Con la contraseña hasheada
        const [rows] = await UserModels.insertUser(nombre, correo, hashedPassword);
         // Ahora la constraseña de "thiago" pasa a ser "$2b$10$wemYF.qxnldHTJnMdxNcQeUBqZHz.FhqUBEmmCCcp/O.."
        
        res.status(201).json({
            message: "Usuario creado con exito",
            usuarioId: rows.insertId
        });

    }catch (error){
        console.log("Error interno del servidor", error);

        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
}