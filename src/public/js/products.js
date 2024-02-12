const socket = io();

let selectedOrder = document.getElementById('order').value;
let productName = document.getElementById('product-name').value.trim();
let currentPage = 1;
let totalPages = 1; // Inicializar totalPages con un valor predeterminado

// Función para obtener productos basados en la página actual, el orden y el nombre del producto ingresado
const fetchProducts = async (page, order, productName) => {
  try {
      let url = `/api/products?page=${page}&order=${order}`;
      if (productName) {
          url += `&title=${productName}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('La respuesta de la red no fue satisfactoria');
      }
      const data = await response.json();
      updateProductList(data);
  } catch (error) {
      console.error('Error al obtener productos:', error);
  }
};


// Función para actualizar la lista de productos e información de paginación
const updateProductList = (data) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (data && Array.isArray(data.products)) {
        data.products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.title} - Precio: $${product.price}`;
            productList.appendChild(listItem);
        });

        const pageInfo = document.getElementById('page-info');
        pageInfo.textContent = `Página ${data.currentPage} de ${data.totalPages}`;
        currentPage = data.currentPage; // Actualizar currentPage globalmente
        totalPages = data.totalPages; // Actualizar totalPages globalmente

        // Actualizar los botones de paginación según la disponibilidad de páginas anterior y siguiente
        document.querySelector('.prev').disabled = !data.hasPrevPage;
        document.querySelector('.next').disabled = !data.hasNextPage;
    } else {
        console.error('Datos de productos inválidos:', data);
    }
};

// Obtención inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts(currentPage, selectedOrder, productName);
});

// Event listener para cambios en el campo de entrada del nombre del producto
document.getElementById('product-name').addEventListener('input', function() {
    productName = this.value.trim();
    currentPage = 1; // Reiniciar currentPage a 1 al filtrar
    fetchProducts(currentPage, selectedOrder, productName);
});

// Event listener para el botón "Anterior"
document.querySelector('.prev').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage--;
    fetchProducts(currentPage, selectedOrder, productName);
  }
});

// Event listener para el botón "Siguiente"
document.querySelector('.next').addEventListener('click', function() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchProducts(currentPage, selectedOrder, productName);
  }
});

// Event listener para cambios en la selección de orden
document.getElementById('order').addEventListener('change', function() {
  selectedOrder = this.value;
  fetchProducts(currentPage, selectedOrder, productName);
});
