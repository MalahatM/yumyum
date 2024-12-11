
const API_KEY = "yum-zaCmZA74PLKCrD8Y";
const ITEMS = [
    {
      id: 1,
      name: "Karlstad",
      ingredients: ["kantarell", "scharlottenlök", "morot", "bladpersilja"],
      price: 9,
    },
    {
      id: 2,
      name: "Bangkok",
      ingredients: ["morot", "salladslök", "chili", "kokos", "lime", "koriander"],
      price: 9,
    },
    {
      id: 3,
      name: "Ho Chi Minh",
      ingredients: ["kål", "morot", "salladslök", "chili", "vitlök", "ingefära", "tofu"],
      price: 9,
    },
    {
      id: 4,
      name: "Paris",
      ingredients: ["kål", "honung", "chevré", "basilika", "valnötspasta"],
      price: 9,
    },
    {
      id: 5,
      name: "Oaxaca",
      ingredients: ["majs", "tomat", "rostade ärtor", "vitlök", "lime"],
      price: 9,
    },
  ];
let cart = [];

// Load menu items dynamically
const menuContainer = document.getElementById("menu-items");
ITEMS.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: ${item.price} SEK</p>
    `;
    menuContainer.appendChild(div);

    div.addEventListener("click", () => {
        const existingItem = cart.find((cartItem) => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        updateCartBadge();
    });
});

// Update cart display
function updateCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");
    cartContainer.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ${item.price} SEK</p>
            <p>Quantity: <span class="quantity">${item.quantity}</span></p>
            <button data-index="${index}" class="remove-from-cart">Remove</button>
            <button data-index="${index}" class="increase-quantity">+</button>
            <button data-index="${index}" class="decrease-quantity">-</button>
        `;
        cartContainer.appendChild(div);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElem.textContent = totalPrice;
}

// Update cart badge
function updateCartBadge() {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartBadge = document.getElementById("cart-badge");

    if (itemCount > 0) {
        cartBadge.textContent = itemCount;
        cartBadge.classList.remove("hidden");
    } else {
        cartBadge.classList.add("hidden");
    }
}

// Handle click on the cart icon (SVG)
document.getElementById("cart-icon-container").addEventListener("click", () => {
    navigateToPage("order");
});

// Increase quantity of an item in the cart
document.getElementById("cart-items").addEventListener("click", (e) => {
    if (e.target.classList.contains("increase-quantity")) {
        const index = Number(e.target.dataset.index);
        cart[index].quantity += 1;
        updateCart();
    } else if (e.target.classList.contains("decrease-quantity")) {
        const index = Number(e.target.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            updateCart();
        }
    } else if (e.target.classList.contains("remove-from-cart")) {
        const index = Number(e.target.dataset.index);
        cart.splice(index, 1);
        updateCart();
        updateCartBadge();
    }
});

// Place order and reset cart
document.getElementById("place-order").addEventListener("click", () => {
    cart = [];
    updateCart();
    updateCartBadge();
    showFaktur();
});

// Show Faktur page
function showFaktur() {
    document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
    document.getElementById("faktur").classList.add("active");
}

// New order
document.getElementById("new-order").addEventListener("click", () => {
    resetApp();
    navigateToPage("menu");
});

// Navigating to the specific page (ensuring only one is active)
function navigateToPage(pageId) {
    // Remove 'active' class from all pages
    document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
    
    // Add 'active' class to the desired page
    document.getElementById(pageId).classList.add("active");
}

// Example of usage:
document.getElementById("cart-icon-container").addEventListener("click", () => {
    navigateToPage("order"); // Navigate to the Order page
});



// Example of usage:
document.getElementById("cart-icon-container").addEventListener("click", () => {
    navigateToPage("order"); // Navigate to the Order page
});


// Reset app state for a new order
function resetApp() {
    cart = [];
    updateCart();
    updateCartBadge();
}

// Set default page to menu
window.addEventListener('DOMContentLoaded', () => {
    navigateToPage("menu");
});
