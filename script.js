const API_KEY = "yum-zaCmZA74PLKCrD8Y";
const ITEMS = [
  { id: 1, name: "Karlstad", ingredients: ["kantarell", "scharlottenlök", "morot", "bladpersilja"], price: 9 },
  { id: 2, name: "Bangkok", ingredients: ["morot", "salladslök", "chili", "kokos", "lime", "koriander"], price: 9 },
  { id: 3, name: "Ho Chi Minh", ingredients: ["kål", "morot", "salladslök", "chili", "vitlök", "ingefära", "tofu"], price: 9 },
  { id: 4, name: "Paris", ingredients: ["kål", "honung", "chevré", "basilika", "valnötspasta"], price: 9 },
  { id: 5, name: "Oaxaca", ingredients: ["majs", "tomat", "rostade ärtor", "vitlök", "lime"], price: 9 },
];

let cart = [];

// Navigation buttons
document.querySelectorAll(".nav-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const page = e.target.dataset.page;
    document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
    document.getElementById(page).classList.add("active");
  })
);

// Load menu items
const menuContainer = document.getElementById("menu-items");
ITEMS.forEach((item) => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.ingredients.join(", ")}</p>
    <p>Price: ${item.price} SEK</p>
    <button data-id="${item.id}" class="add-to-cart">Add to Cart</button>
  `;
  menuContainer.appendChild(div);
});

// Add to cart
menuContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = Number(e.target.dataset.id);
    const item = ITEMS.find((item) => item.id === id);
    cart.push(item);
    updateCart();
    updateCartBadge();
  }
});

// Update cart
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
      <button data-index="${index}" class="remove-from-cart">Remove</button>
    `;
    cartContainer.appendChild(div);
    totalPrice += item.price;
  });

  totalPriceElem.textContent = totalPrice;
}

// Remove from cart
document.getElementById("cart-items").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    const index = Number(e.target.dataset.index);
    cart.splice(index, 1);
    updateCart();
    updateCartBadge();
  }
});

// Place order
document.getElementById("place-order").addEventListener("click", () => {
  const totalPaymentElem = document.getElementById("total-payment");

  // Calculate total payment
  const totalPayment = cart.reduce((acc, item) => acc + item.price, 0);

  // Update Faktur page with total
  totalPaymentElem.textContent = `Total Payment: ${totalPayment} SEK`;

  // Clear cart and update UI
  cart = [];
  updateCart();
  updateCartBadge();
  showFaktur();
});

// Show Faktur
function showFaktur() {
  document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
  document.getElementById("faktur").classList.add("active");
}

// New order
document.getElementById("new-order").addEventListener("click", () => {
  document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
  document.getElementById("menu").classList.add("active");
});

// Update cart badge
const cartBadge = document.getElementById("cart-badge");
function updateCartBadge() {
  const itemCount = cart.length;
  if (itemCount > 0) {
    cartBadge.textContent = itemCount;
    cartBadge.classList.remove("hidden");
  } else {
    cartBadge.classList.add("hidden");
  }
}
