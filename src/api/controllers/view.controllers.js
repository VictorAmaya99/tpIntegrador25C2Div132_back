import productModels from "../models/product.models.js";

export const productsView = async (req, res) => {
      
    try {
        const [rows] = await productModels.selectAllProducts();

        res.render("index", {
            title: "Inicio",
            about: "Listado principal",
            productos: rows
        })

    } catch (error) {
        console.error(error);
    }
}