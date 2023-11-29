document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('addProductBtn');
    const calculateTotalBtn = document.getElementById('calculateTotalBtn');
    const applyDiscountCheckbox = document.getElementById('applyDiscount');
    const applyTaxCheckbox = document.getElementById('applyTax');

    addProductBtn.addEventListener('click', addProductInput);
    calculateTotalBtn.addEventListener('click', calculateTotal);
});

function addProductInput() {
    const productInputs = document.getElementById('productInputs');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product', 'input-group', 'mb-3');

    newProductDiv.innerHTML = `
        <input type="text" class="form-control" placeholder="Nombre del Producto/Servicio" name="productName[]">
        <input type="number" class="form-control" placeholder="Precio" name="productPrice[]">
    `;

    productInputs.appendChild(newProductDiv);
}

function aplicarDescuento(precio, aplicarDescuento) {
    if (aplicarDescuento) {
        const descuento = Math.random() * 0.2; // Descuento de hasta un 20%
        return precio - (precio * descuento);
    }
    return precio;
}

function calcularImpuesto(total, aplicarImpuesto) {
    if (aplicarImpuesto) {
        const impuesto = 0.15; // 15% de impuesto
        return total * impuesto;
    }
    return 0;
}

function calculateTotal() {
    let totalSinImpuestos = 0;
    const applyDiscount = document.getElementById('applyDiscount').checked;
    const applyTax = document.getElementById('applyTax').checked;
    const prices = document.querySelectorAll('input[name="productPrice[]"]');

    prices.forEach(priceInput => {
        let precioConDescuento = aplicarDescuento(Number(priceInput.value), applyDiscount);
        totalSinImpuestos += precioConDescuento;
    });

    let totalConImpuestos = totalSinImpuestos + calcularImpuesto(totalSinImpuestos, applyTax);

    let detalleCalculo = '';
    prices.forEach((priceInput, index) => {
        let precioOriginal = Number(priceInput.value);
        let precioConDescuento = aplicarDescuento(precioOriginal, applyDiscount);
        detalleCalculo += `Producto ${index + 1}: Precio Original: $${precioOriginal.toFixed(2)}, Precio con Descuento: $${precioConDescuento.toFixed(2)}<br>`;
    });

    detalleCalculo += `Total sin Impuestos: $${totalSinImpuestos.toFixed(2)}<br>`;
    if (applyTax) {
        detalleCalculo += `Impuesto: $${calcularImpuesto(totalSinImpuestos, applyTax).toFixed(2)}<br>`;
    }
    detalleCalculo += `Total con Impuestos: $${totalConImpuestos.toFixed(2)}`;

    document.getElementById('totalCostDisplay').innerText = `Total: $${totalConImpuestos.toFixed(2)}`;
    document.getElementById('detalleCalculo').innerHTML = detalleCalculo;
}
