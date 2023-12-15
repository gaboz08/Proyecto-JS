// Mycode.js
// Este código maneja la lógica de la interfaz de usuario para añadir productos y calcular el total

// Añadir un listener para cuando se cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los botones y añadir event listeners
    const addProductBtn = document.getElementById('addProductBtn');
    const calculateTotalBtn = document.getElementById('calculateTotalBtn');

    addProductBtn.addEventListener('click', addProductInput);
    calculateTotalBtn.addEventListener('click', calculateTotal);
});

// Función para añadir un nuevo input de producto al formulario
function addProductInput() {
    const productInputs = document.getElementById('productInputs');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product', 'input-group', 'mb-3');

    // Agregar inputs para nombre, precio y cantidad del producto
    newProductDiv.innerHTML = `
        <div class="autocomplete">
            <input type="text" class="form-control productName" placeholder="Nombre del Producto/Servicio" name="productName[]">
            <div class="autocomplete-results"></div>
        </div>
        <input type="number" class="form-control productPrice" placeholder="Precio" name="productPrice[]">
        <input type="number" class="form-control" placeholder="Cantidad" name="productQuantity[]" min="1" value="1">
    `;

    productInputs.appendChild(newProductDiv);

    // Añadir evento de autocompletado al input de nombre de producto
    let productNameInput = newProductDiv.querySelector('.productName');
    productNameInput.addEventListener('input', function() {
        autocompleteProduct(this);
    });
}

// Función para mostrar sugerencias de autocompletado
function autocompleteProduct(inputElement) {
    let autocompleteResults = inputElement.nextElementSibling;
    autocompleteResults.innerHTML = '';

    // Filtrar productos basados en la entrada del usuario
    let filteredProducts = productos.filter(p => p.nombre.toLowerCase().includes(inputElement.value.toLowerCase()));

    // Mostrar los resultados filtrados como opciones de autocompletado
    filteredProducts.forEach(product => {
        let div = document.createElement('div');
        div.classList.add('autocomplete-item');
        div.textContent = product.nombre;
        div.onclick = function() {
            selectProduct(inputElement, product, autocompleteResults);
        };
        autocompleteResults.appendChild(div);
    });

    // Hacer el campo de precio editable si no hay coincidencias
    if (filteredProducts.length === 0) {
        inputElement.parentElement.nextElementSibling.removeAttribute('readonly');
    } else {
        inputElement.parentElement.nextElementSibling.setAttribute('readonly', true);
    }
}

// Función para manejar la selección de un producto desde las sugerencias
function selectProduct(inputElement, product, autocompleteResults) {
    // Establecer el valor del input del nombre y el precio
    inputElement.value = product.nombre;
    let priceInput = inputElement.parentElement.nextElementSibling;
    priceInput.value = product.precio;
    autocompleteResults.innerHTML = '';
}

// Función para aplicar un descuento aleatorio
function aplicarDescuento(precio, aplicarDescuento) {
    if (aplicarDescuento) {
        const descuento = Math.random() * 0.2; // Descuento aleatorio hasta un 20%
        return precio - (precio * descuento);
    }
    return precio;
}

// Función para calcular el impuesto
function calcularImpuesto(total, aplicarImpuesto) {
    if (aplicarImpuesto) {
        const impuesto = 0.15; // Impuesto del 15%
        return total + (total * impuesto);
    }
    return total;
}

// Función para calcular el total de los productos añadidos
function calculateTotal() {
    let totalSinImpuestos = 0;
    const applyDiscount = document.getElementById('applyDiscount').checked;
    const applyTax = document.getElementById('applyTax').checked;
    const productNames = document.querySelectorAll('input[name="productName[]"]');
    const prices = document.querySelectorAll('input[name="productPrice[]"]');
    const quantities = document.querySelectorAll('input[name="productQuantity[]"]');

    productNames.forEach((productNameInput, index) => {
        if (productNameInput.value) {
            let precioOriginal = Number(prices[index].value) || 0;
            let cantidad = Number(quantities[index].value) || 1;
            let precioConDescuento = aplicarDescuento(precioOriginal, applyDiscount);
            let subtotal = precioConDescuento * cantidad;
            totalSinImpuestos += subtotal;
        }
    });

    let totalConImpuestos = calcularImpuesto(totalSinImpuestos, applyTax);
    mostrarDetalleCalculo(productNames, prices, quantities, totalSinImpuestos, totalConImpuestos, applyTax);
}

// Función para mostrar los detalles del cálculo en la interfaz de usuario
function mostrarDetalleCalculo(productNames, prices, quantities, totalSinImpuestos, totalConImpuestos, applyTax) {
    let detalleCalculo = '';
    productNames.forEach((productNameInput, index) => {
        if (productNameInput.value) {
            let precioOriginal = Number(prices[index].value) || 0;
            let cantidad = Number(quantities[index].value) || 1;
            let precioConDescuento = aplicarDescuento(precioOriginal, document.getElementById('applyDiscount').checked);
            detalleCalculo += `Producto ${index + 1}: ${productNameInput.value} - Precio Original: $${precioOriginal.toFixed(2)}, Cantidad: ${cantidad}, Precio con Descuento: $${precioConDescuento.toFixed(2)}, Subtotal: $${(precioConDescuento * cantidad).toFixed(2)}<br>`;
        }
    });

    detalleCalculo += `Total sin Impuestos: $${totalSinImpuestos.toFixed(2)}<br>`;
    if (applyTax) {
        detalleCalculo += `Impuesto: $${(totalConImpuestos - totalSinImpuestos).toFixed(2)}<br>`;
    }
    detalleCalculo += `Total con Impuestos: $${totalConImpuestos.toFixed(2)}`;

    document.getElementById('totalCostDisplay').innerHTML = `Total: $${totalConImpuestos.toFixed(2)}`;
    document.getElementById('detalleCalculo').innerHTML = detalleCalculo;
}
