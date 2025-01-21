const API_URL = "http://localhost:5000/products";

export const productServices = {
    productList: async () => {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener la lista de productos");
        return response.json();
    },
    createProduct: async (name, price, image) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, image }),
        });
        if (!response.ok) throw new Error("Error al crear el producto");
        return response.json();
    },
    deleteProduct: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar el producto");
    },
};

