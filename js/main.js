import { productServices } from "./products.js";

const form = document.querySelector("[data-form]");
const productsContainer = document.querySelector("[data-product]");

// Crear tarjeta de producto
function createCard({ name, price, image, id }) {
    const card = document.createElement("div");
    
    const imageElement = document.createElement("img");
    imageElement.src = image;
    imageElement.alt = name;
    imageElement.classList.add("imageProduct");

    const nameElement = document.createElement("p");
    nameElement.textContent = name;
    nameElement.classList.add("nameProduct");

    const priceElement = document.createElement("div");
    priceElement.classList.add("price");

    const priceText = document.createElement("p");
    priceText.textContent = `$ ${price}`;

    const deleteButton = document.createElement("img");
    deleteButton.src = "./img/trashIcon.svg";
    deleteButton.alt = "Eliminar";
    deleteButton.classList.add("delete-button");
    deleteButton.dataset.id = id;

    priceElement.append(priceText, deleteButton);
    card.append(imageElement, nameElement, priceElement);


    addDeleteEvent(card, id);
    return card;
}

// Agregar evento para eliminar producto
function addDeleteEvent(card, id) {
    const deleteButton = card.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
        try {
            await productServices.deleteProduct(id);
            card.remove();
            console.log(`Producto con id ${id} eliminado`);
        } catch (error) {
            console.error(`Error al eliminar el producto con id ${id}:`, error);
        }
    });
}

// Renderizar productos
async function renderProducts() {
    try {
        const products = await productServices.productList();
        productsContainer.innerHTML = ""; // Limpiar contenedor
        products.forEach((product) => {
            const productCard = createCard(product);
            productsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error al renderizar productos:", error);
    }
}

// Manejar envío del formulario
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.querySelector("[data-name]").value.trim();
    const price = parseFloat(form.querySelector("[data-price]").value.trim());
    const imageInput = form.querySelector("[data-image]");
    const imageFile = imageInput ? imageInput.files[0] : null;
    // const image = `./img/${imageFile.name}`;
    let image;

    if (imageFile) {
        image = `./img/${imageFile.name}`; // Ruta de la imagen
    } else {
        image = "./img/default.jpg"; // Imagen predeterminada si no se sube ninguna
    }

    if (!name || isNaN(price) || !imageFile) {
        alert("Todos los campos son obligatorios y deben ser válidos.");
        return;
    }
    

    try {
        const newProduct = await productServices.createProduct(name, price, image);
        const productCard = createCard(newProduct);
        productsContainer.appendChild(productCard);
        form.reset(); // Limpiar formulario
        console.log("Producto creado:", newProduct);
    } catch (error) {
        console.error("Error al crear el producto:", error);
    }
});

// Inicializar
renderProducts();
