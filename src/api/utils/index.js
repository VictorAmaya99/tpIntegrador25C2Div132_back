/*=====================================================================================

    Este archivo se encarga de obtener correctamente la ruta absoluta del proyecto (la carpeta raíz), algo que no existe por defecto en ES Modules (import/export).

    En CommonJS (require), tenías __dirname automáticamente.
    En ES Modules, no existe, así que hay que reconstruirlo manualmente.

    Este archivo crea tu propio __dirname y lo exporta para usarlo en toda la app.


    Este archivo crea versiones manuales de __filename y __dirname (que no existen en ESM), permitiendo construir rutas absolutas seguras. Gracias a eso, Express puede encontrar vistas EJS, archivos estáticos, y funcionar bien en cualquier entorno.
=======================================================================================*/


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