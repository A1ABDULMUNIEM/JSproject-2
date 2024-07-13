document.addEventListener("DOMContentLoaded", function() {
    loadCartItems();

    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert("Thank you for your purchase!");
    });
});


function loadCartItems() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    let cartTotal = 0;
    cartItems.forEach((item, index) => {
        const total = item.quantity * item.price;
        cartTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>
                <input type="number" class="form-control quantity-input" data-index="${index}" value="${item.quantity}" min="1">
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    document.getElementById('cart-total').textContent = `Total: $${cartTotal.toFixed(2)}`;

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
}

function updateQuantity(event) {
    const index = event.target.dataset.index;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const newQuantity = parseInt(event.target.value);

    if (newQuantity > 0) {
        cartItems[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCartItems();
    } else {
        event.target.value = cartItems[index].quantity;
    }
}

function removeCartItem(event) {
    const index = event.target.dataset.index;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    loadCartItems();
}