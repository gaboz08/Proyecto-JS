document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('addProductBtn');
    const calculateTotalBtn = document.getElementById('calculateTotalBtn');

    addProductBtn.addEventListener('click', addProductInput);
    calculateTotalBtn.addEventListener('click', calculateTotal);
});

function addProductInput() {
    const productInputs = document.getElementById('productInputs');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('product');

    newProductDiv.innerHTML = `
        <input type="text" placeholder="Nombre del Producto/Servicio" name="productName[]">
        <input type="number" placeholder="Precio" name="productPrice[]">
    `;

    productInputs.appendChild(newProductDiv);
}

function calculateTotal() {
    let total = 0;
    const prices = document.querySelectorAll('input[name="productPrice[]"]');

    prices.forEach(priceInput => {
        total += Number(priceInput.value);
    });

    document.getElementById('totalCostDisplay').innerText = `Total: $${total.toFixed(2)}`;
}
