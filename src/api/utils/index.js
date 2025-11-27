
// Importacion de modulos para poder trabajar con rutas 
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Logica para obtener el nombre del archivo actual 
const __filename = fileURLToPath(import.meta.url); // Convertimos las rutas de nuestra carpeta public en rutas normales

// Obtener el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../"); //Apuntamos a la carpeta raiz del proyecto retrocediendo tres niveles -> utils a api, api a src, src tpIntegradorBack(carpeta raiz).

export {
    __dirname,
    join
}