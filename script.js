let cart = [];
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const menuSection = document.getElementById('menu-section');
const cartSection = document.getElementById('cart-section');
const orderList = document.getElementById('order-list');
const totalPriceElement = document.getElementById('total-price');
const cartItemCount = document.getElementById('cart-item-count'); 

// Event listener for 'Add to Cart' buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const item = this.getAttribute('data-item');
    const price = parseFloat(this.getAttribute('data-price'));

    // Add item to cart
    cart.push({ item, price });
    updateCart();
  });
});

// Function to update cart display
function updateCart() {
  // Clear current order list
  orderList.innerHTML = '';

  // Add each item in the cart to the order list
  let total = 0;
  cart.forEach(cartItem => {
    const orderItem = document.createElement('div');
    orderItem.classList.add('order-item');
    orderItem.innerHTML = `
      <p>${cartItem.item} - ${cartItem.price} SEK</p>
    `;
    orderList.appendChild(orderItem);
    total += cartItem.price;
  });

  // Update total price
  totalPriceElement.textContent = `${total} SEK`;

  // Update the cart item count
  cartItemCount.textContent = cart.length; // antal for basket
}

// Back to menu
backToMenuBtn.addEventListener('click', function() {
  // Hide cart and show menu
  cartSection.classList.add('hidden');
  menuSection.classList.remove('hidden');
});
