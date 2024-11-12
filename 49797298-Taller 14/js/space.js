function buscarGalaxias(texto) {
const url = "https://images-api.nasa.gov/search?q=${texto}";
} 

function getJSONData(url) {
    return fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(Error(response.statusText)))
        .then(response => ({
            status: 'ok',
            data: response.collection.items
        }))
        .catch(error => ({
            status: 'error',
            data: error
        }));
}

document.addEventListener('DOMContentLoaded', function () {
    const btnBuscar = document.getElementById("btnBuscar");
    const inputBuscar = document.getElementById("inputBuscar");
    const contenedor = document.getElementById("contenedor");
    let products = [];

    // Cargar datos iniciales de la API
    getJSONData(galaxiasURL).then(function (respObj) {
        if (respObj.status === "ok") {
            products = respObj.data; // Guardamos las galaxias
            mostrarGalaxias(products); // Muestra las galaxias al inicio
        } else {
            console.error('Error al cargar los datos:', respObj.data);
        }
    });

    // Evento de clic en el botón "Buscar imágenes"
    btnBuscar.addEventListener('click', function () {
        const query = inputBuscar.value.trim().toLowerCase(); // Asegurarnos de quitar espacios y hacer todo minúsculas

        if (!query) {
            // Si la consulta está vacía, mostrar todos los resultados
            mostrarGalaxias(products);
            return;
        }

        const filteredProducts = products.filter(product => {
            const title = product.data[0]?.title?.toLowerCase() || ''; // Asegurarnos de que title existe
            const description = product.data[0]?.description?.toLowerCase() || ''; // Asegurarnos de que description existe

            return title.includes(query) || description.includes(query);
        });

        if (filteredProducts.length === 0) {
            contenedor.innerHTML = "<p>No se encontraron resultados para tu búsqueda.</p>";
        } else {
            mostrarGalaxias(filteredProducts); // Muestra solo los resultados filtrados
        }
    });

    // Función para mostrar las galaxias en el HTML
    function mostrarGalaxias(galaxias) {
        contenedor.innerHTML = ""; // Limpiar resultados anteriores

        if (galaxias.length === 0) {
            contenedor.innerHTML = "<p>No se encontraron galaxias.</p>";
        } else {
            galaxias.forEach(galaxia => {
                const div = document.createElement("div");
                const title = galaxia.data[0]?.title || "Sin título"; // Asegurarnos de que title existe
                const description = galaxia.data[0]?.description || "Descripción no disponible";
                const imgURL = galaxia.links[0]?.href || ''; // Asegurarnos de que existe un enlace a la imagen

                div.classList.add("card", "mb-3", "shadow-sm");

                div.innerHTML =
                 `
<div class="card" style="width: 18rem;">
<img src="${imgURL}" class="card-img-top" alt="${title}">
<div class="card-body">
<h5 class="card-title">${title}</h5>
<p class="card-text">${description}</p>
</div>
</div>
                `;

                contenedor.appendChild(div);
            });
        }
    }
});
