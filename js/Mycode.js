// Mycode.js
// Este código maneja la lógica de la interfaz de usuario para añadir productos y calcular el total

document.addEventListener('DOMContentLoaded', function() {
    recuperarProductosDelStorage();
    const addProductBtn = document.getElementById('addProductBtn');
    const calculateTotalBtn = document.getElementById('calculateTotalBtn');

    addProductBtn.addEventListener('click', addProductInput);
    calculateTotalBtn.addEventListener('click', calculateTotal);
    document.getElementById('productInputs').addEventListener('input', updateTotalInRealTime);
    document.getElementById('applyDiscount').addEventListener('change', updateTotalInRealTime);
    document.getElementById('applyTax').addEventListener('change', updateTotalInRealTime);
});

function addProductInput() {
    const productInputs = document.getElementById('productInputs');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product', 'input-group', 'mb-3');

    newProductDiv.innerHTML = `
        <div class="autocomplete">
            <input type="text" class="form-control productName" placeholder="Nombre del Producto/Servicio" name="productName[]">
            <div class="autocomplete-results"></div>
        </div>
        <input type="number" class="form-control productPrice" placeholder="Precio" name="productPrice[]">
        <input type="number" class="form-control" placeholder="Cantidad" name="productQuantity[]" min="1" value="1">
        <button class="btn btn-danger btn-sm" onclick="removeProductInput(this)">X</button>
    `;

    productInputs.appendChild(newProductDiv);
    let productNameInput = newProductDiv.querySelector('.productName');
    productNameInput.addEventListener('input', function() {
        autocompleteProduct(this);
    });
}

function removeProductInput(button) {
    button.parentElement.remove();
    updateTotalInRealTime();
}

function updateTotalInRealTime() {
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
    document.getElementById('totalCostDisplay').innerHTML = `Total: $${totalConImpuestos.toFixed(2)}`;
}

function calcularImpuesto(total, aplicarImpuesto) {
    if (aplicarImpuesto) {
        const impuesto = 0.15; // Impuesto del 15%
        return total + (total * impuesto);
    }
    return total;
}

function aplicarDescuento(precio, aplicarDescuento) {
    if (aplicarDescuento) {
        const descuento = Math.random() * 0.2; // Descuento aleatorio hasta un 20%
        return precio - (precio * descuento);
    }
    return precio;
}

function guardarProductosEnStorage() {
    const productos = Array.from(document.querySelectorAll('.product')).map(productDiv => {
        return {
            nombre: productDiv.querySelector('.productName').value,
            precio: productDiv.querySelector('.productPrice').value,
            cantidad: productDiv.querySelector('.productQuantity').value
        };
    });
    localStorage.setItem('productos', JSON.stringify(productos));
}

function recuperarProductosDelStorage() {
    const productos = JSON.parse(localStorage.getItem('productos'));
    if (productos) {
        productos.forEach(producto => {
            addProductInput();
            const lastProductDiv = document.querySelector('.product:last-child');
            lastProductDiv.querySelector('.productName').value = producto.nombre;
            lastProductDiv.querySelector('.productPrice').value = producto.precio;
            lastProductDiv.querySelector('.productQuantity').value = producto.cantidad;
        });
    }
}

// Aquí deberás implementar las funciones autocompleteProduct y selectProduct,
// asegurándote de que interactúan correctamente con tus datos de productos.



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
