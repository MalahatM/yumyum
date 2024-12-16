const API_KEY = "yum-zaCmZA74PLKCrD8Y";
const apiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com'
const tenantId = "a2f4"

async function loadMenuItems() {
    try {
        const response = await fetch(`${apiUrl}/menu`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': API_KEY
            },
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        
        // Extract items from the response
        const menuItems = data.items;
        
        if (!menuItems || !Array.isArray(menuItems)) {
            console.error('No menu items found in response');
            return [];
        }
        
        return menuItems;
    } catch (error) {
        console.error('Error loading menu items:', error);
        return []; // Return empty array if API fails
    }
}

function addToCart(item) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
    updateCartBadge();
}

let cart = [];

// Update cart display
function updateCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElem = document.getElementById("total-price");
    cartContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Din varukorg är tom</p>';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <h3>${item.name}</h3>
            <div class="quantity-controls">
                <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
            </div>
            <p>Pris: ${item.price * item.quantity} SEK</p>
        `;
        cartContainer.appendChild(div);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElem.textContent = `${totalPrice}`;
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
    }
});

// Place order and reset cart
document.getElementById("place-order").addEventListener("click", async () => {
    if (cart.length === 0) {
        alert('Din varukorg är tom!');
        return;
    }
    
    try {
        await placeOrder();
        cart = [];
        updateCart();
        updateCartBadge();
    } catch (error) {
        console.error('Error:', error);
        alert('Något gick fel när ordern skulle läggas.');
    }
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
    document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

// Reset app state for a new order
function resetApp() {
    cart = [];
    updateCart();
    updateCartBadge();
}

// Initialize app when the page loads
async function initializeApp() {
    try {
        const menuItems = await loadMenuItems();
        displayMenuItems(menuItems);
        
        document.getElementById("cart-icon-container").addEventListener("click", () => {
            navigateToPage("order");
        });
        
        document.getElementById("new-order").addEventListener("click", () => {
            resetApp();
            navigateToPage("menu");
        });
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Kunde inte starta appen. Försök ladda om sidan.');
    }
}

// Call when page loads
document.addEventListener('DOMContentLoaded', initializeApp);

// Organize menu items by category
function displayMenuItems(items) {

    if (!items || !Array.isArray(items)) {
        console.error('Invalid menu items format:', items);
        return;
    }

    const menuContainer = document.getElementById("menu-items");
    if (!menuContainer) {
        console.error('Menu container not found');
        return;
    }

    menuContainer.innerHTML = ''; // Clear existing items
    
    // Create sections with updated wonton filter
    const sections = {
        wontons: items.filter(item => item.type === "wonton"),
        dips: items.filter(item => item.type === "dip"),
        drinks: items.filter(item => item.type === "drink")
    };

    // Create each section
    Object.entries(sections).forEach(([sectionName, sectionItems]) => {
        if (sectionItems.length === 0) return; // Skip empty sections

        const section = document.createElement('div');
        section.className = 'menu-section';
        
        // Custom section titles
        const sectionTitles = {
            wontons: 'Wontons',
            dips: 'Dips',
            drinks: 'Drycker'
        };
        
        section.innerHTML = `<h2>${sectionTitles[sectionName]}</h2>`;
        
        sectionItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <h3>${item.name}</h3>
                ${item.ingredients ? 
                    `<p>Ingredienser: ${item.ingredients.join(', ')}</p>` : 
                    `<p>${item.description || ''}</p>`}
                <p>Pris: ${item.price} SEK</p>
            `;
            
            itemDiv.addEventListener('click', () => addToCart(item));
            section.appendChild(itemDiv);
        });
        
        menuContainer.appendChild(section);
    });
}

async function placeOrder() {
    try {
        const orderData = {
            items: cart.map(item => item.id)
        };

        const response = await fetch(`${apiUrl}/${tenantId}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-zocom': API_KEY
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Order failed');

        const data = await response.json();
        showReceipt(data.order.id);
        navigateToPage('faktur');
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Det gick inte att lägga ordern. Försök igen.');
    }
}

function showReceipt(orderId) {
    const receiptText = document.getElementById('confirmation-text');
    receiptText.innerHTML = `
        Tack för din beställning!<br><br>
        Order ID: ${orderId}<br><br>
        Din mat kommer snart!
    `;
    navigateToPage('faktur');
}

