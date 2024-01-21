// Clase para gestionar productos
class ProductManager {
    constructor() {
        this.products = [];
    }

    addOrUpdateProduct(name, price, quantity) {
        const existingProductIndex = this.products.findIndex(p => p.name === name);

        if (existingProductIndex > -1) {
            this.products[existingProductIndex].quantity = Number(quantity);
        } else {
            if (!name || price === '' || quantity === '') {
                alert("Por favor, completa todos los campos del producto.");
                return false;
            }
            this.products.push({ name, price: Number(price), quantity: Number(quantity) });
        }
        return true;
    }

    // Función para eliminar un producto del arreglo de productos
    removeProduct(name) {
        this.products = this.products.filter(p => p.name !== name);
    }

    calculateTotal(applyDiscount, applyTax) {
        let totalSinImpuestos = this.products.reduce((total, product) => {
            let precioConDescuento = applyDiscount ? aplicarDescuento(product.price) : product.price;
            return total + precioConDescuento * product.quantity;
        }, 0);

        return applyTax ? calcularImpuesto(totalSinImpuestos) : totalSinImpuestos;
    }

    generateResumen(applyDiscount) {
        let resumen = '';
        this.products.forEach((product, index) => {
            let precioConDescuento = applyDiscount ? aplicarDescuento(product.price) : product.price;
            let subtotal = precioConDescuento * product.quantity;
            resumen += `Producto ${index + 1}: ${product.name} - Precio Original: $${product.price.toFixed(2)}, Cantidad: ${product.quantity}, Precio con Descuento: $${precioConDescuento.toFixed(2)}, Subtotal: $${subtotal.toFixed(2)}<br>`;
        });
        return resumen;
    }
}

// Instancia de la clase ProductManager
const productManager = new ProductManager();

// Eventos para manejar la interacción con la interfaz
document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('addProductBtn');
    addProductBtn.addEventListener('click', addProductInput);

    const calculateTotalBtn = document.getElementById('calculateTotalBtn');
    calculateTotalBtn.addEventListener('click', calculateTotal);
});

// Función para añadir un nuevo input de producto en la interfaz
function addProductInput() {
    const productInputs = document.getElementById('productInputs');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product', 'input-group', 'mb-3');
    newProductDiv.innerHTML = `
        <div class="autocomplete">
            <input type="text" class="form-control productName" placeholder="Nombre del Producto/Servicio" oninput="autocompleteProduct(this)">
            <div class="autocomplete-results" style="display: none;"></div>
        </div>
        <input type="number" class="form-control productPrice" placeholder="Precio" readonly>
        <input type="number" class="form-control productQuantity" placeholder="Cantidad" min="1" value="1">
        <button class="btn btn-danger btn-sm" onclick="removeProductInput(this)">X</button>
    `;
    productInputs.appendChild(newProductDiv);
}

// Función para eliminar un input de producto de la interfaz
function removeProductInput(button) {
    // Obtén el nombre del producto desde el input correspondiente
    const productName = button.parentElement.querySelector('.productName').value;

    // Elimina el producto del ProductManager
    productManager.removeProduct(productName);

    // Elimina el div del producto de la interfaz
    button.parentElement.remove();

    // Actualiza el total
    updateTotalInRealTime();
}

// Función para actualizar el total en tiempo real
function updateTotalInRealTime() {
    const applyDiscount = document.getElementById('applyDiscount').checked;
    const applyTax = document.getElementById('applyTax').checked;
    let total = productManager.calculateTotal(applyDiscount, applyTax);
    document.getElementById('totalCostDisplay').innerHTML = `Total: $${total.toFixed(2)}`;
}

// Función para calcular el total y mostrar el detalle del cálculo
function calculateTotal() {
    const applyDiscount = document.getElementById('applyDiscount').checked;
    const applyTax = document.getElementById('applyTax').checked;
    let total = productManager.calculateTotal(applyDiscount, applyTax);
    let detalleCalculo = productManager.generateResumen(applyDiscount);
    
    if (applyTax) {
        const impuesto = calcularImpuesto(total) - total;
        detalleCalculo += `Impuesto: $${impuesto.toFixed(2)}<br>`;
    }

    detalleCalculo += `Total con Impuestos: $${total.toFixed(2)}`;
    document.getElementById('totalCostDisplay').innerHTML = `Total: $${total.toFixed(2)}`;
    document.getElementById('detalleCalculo').innerHTML = detalleCalculo;
}

// Función para aplicar un descuento aleatorio al precio
function aplicarDescuento(precio) {
    const descuento = Math.random() * 0.2;
    return precio - (precio * descuento);
}

// Función para calcular el impuesto sobre el total
function calcularImpuesto(total) {
    const impuesto = 0.15; // Tasa de impuesto del 15%
    return total + (total * impuesto);
}

// Función para el autocompletado de nombres de productos
function autocompleteProduct(inputElement) {
    let autocompleteResults = inputElement.nextElementSibling;
    autocompleteResults.innerHTML = '';
    autocompleteResults.style.display = 'none';

    let filteredProducts = productos.filter(p => p.nombre.toLowerCase().includes(inputElement.value.toLowerCase()));

    if (filteredProducts.length > 0) {
        autocompleteResults.style.display = 'block';
    }

    filteredProducts.forEach(product => {
        let div = document.createElement('div');
        div.classList.add('autocomplete-item');
        div.textContent = product.nombre;
        div.onclick = function() {
            selectProduct(inputElement, product, div.parentElement);
        };
        autocompleteResults.appendChild(div);
    });
}

// Función para seleccionar un producto del autocompletado
function selectProduct(inputElement, product, autocompleteResults) {
    inputElement.value = product.nombre;
    let priceInput = inputElement.parentElement.parentElement.querySelector('.productPrice');
    let quantityInput = inputElement.parentElement.parentElement.querySelector('.productQuantity');
    priceInput.value = product.precio;
    quantityInput.value = 1; // Establece la cantidad inicial a 1
    quantityInput.addEventListener('change', () => {
        // Actualizar el producto en ProductManager cuando cambia la cantidad
        productManager.addOrUpdateProduct(product.nombre, product.precio, quantityInput.value);
        updateTotalInRealTime();
    });
    productManager.addOrUpdateProduct(product.nombre, product.precio, 1);
    autocompleteResults.innerHTML = '';
    autocompleteResults.style.display = 'none';
    updateTotalInRealTime();
}
