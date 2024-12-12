
const API_KEY = "yum-zaCmZA74PLKCrD8Y";
const apiUrl = 'https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/'



async function loadMenuItems() {
    try {
        const response = await fetch(' https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${"yum-zaCmZA74PLKCrD8Y"}`, // Use the API_KEY for authorization
            },
        });
        const data = await response.json();
        displayMenuItems(data);
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
}



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
	{
		id: 6,
		"type": "dip",
		name: "Sweet Chili",
		"description": "Stark och söt dip från Thailänska höglandet.",
		price: 19
	  },
	  {
		id: 7,
		"type": "dip",
		name: "Sweet & Sour",
		"description": "Klassiska sötsura dipsåsen från Kina.",
		price: 19
	  },
	  {
		id: 8,
		"type": "dip",
		name: "Guacamole",
		"description": "Avocado, tomat och kryddor i optimal kombination.",
		price: 19
	  },
	  {
		id: 9,
		"type": "dip",
		name: "Wonton Standard",
		"description": "Smaksatt olja med soya, chili, vitlök & ingefära.",
		price: 19
	  },
	  {
		id: 10,
		"type": "dip",
		name: "Hot Mango",
		"description": "Kryddstark och söt chunky mangodip.",
		price: 19
	  },
	  {
		id: 11,
		"type": "dip",
		name: "Chili Mayo",
		"description": "Egengjord majonäs smaksatt med chili.",
		price: 19
	  },
	{
		id: 12,
		"type": "drink",
		name: "Sprite",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  },
	  {
		id: 13,
		"type": "drink",
		name: "Fanta Orange",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  },
	  {
		id: 14,
		"type": "drink",
		name: "Fanta Exotic",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  },
	  {
		id: 15,
		"type": "drink",
		name: "Coca Cola",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  },
	  {
		id: 16,
		"type": "drink",
		name: "LOKA Citrus",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  },
	  {
		id: 17,
		"type": "drink",
		name: "LOKA Granatäpple",
		"description": "Lorem ipsum dolor sit amet, bubbly fruity elit. Fizzy carbonated.",
		price: 19
	  }
]









let cart = [];

// Load menu items dynamically
const menuContainer = document.getElementById("menu-items");
/*ITEMS.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
        <h3>${item.name}</h3>
	    <p>Price: ${item.price} SEK</p>
    `;*/


	ITEMS.forEach((item) => {
		const div = document.createElement("div");
		div.className = "item";
	
		// Check item type for dips and drinks
		if (item.type === "dip" || item.type === "drink") {
			// Show only name and price for dips and drinks
			div.innerHTML =`
				<h3>${item.name}</h3>
				<p>Pris: ${item.price} SEK</p>
			`;
		} else {
			// Show name, ingredients, and price for other types
			const ingredients = item.ingredients
				? `Ingredienser: ${item.ingredients.join(", ")}`
				: ""; // Leave empty if no ingredients
			div.innerHTML =` 
				<h3>${item.name}</h3>
				<p>${ingredients}</p>
				<p>Pris: ${item.price} SEK</p>
			`;
		}





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

