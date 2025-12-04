// routes/index.js////////////////////////////////////////////
// Importamos las rutas de productos y vistas
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import userRoutes from "./user.routes.js";

// Export con nombre
// export { productRoutes, viewRoutes, userRoutes, sales };

export { productRoutes, 
         viewRoutes,
         userRoutes
    }; 