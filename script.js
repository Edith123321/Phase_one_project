// Element selectors
const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close');
const body = document.querySelector('body');
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

// Adding items to an array
let listProducts = [];
let carts = [];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Render products into the HTML
const renderProducts = (productList = listProducts) => {
    listProductHTML.innerHTML = ""; // Clear existing content
    productList.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('item');
        productElement.dataset.id = product.id;


        const defaultSize = product.dimensions[0];
        const defaultPrice = defaultSize.price;


        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <div class="dimensions">
                ${product.dimensions.map(dim => `
                    <button class="size-button" data-size="${dim.size}" data-price="${dim.price}">
                        ${dim.size}
                    </button>
                `).join('')}
            </div>
            <div class="price">Kes ${defaultPrice}</div>
            <button class="addCart">Add to cart</button>
        `;
        listProductHTML.appendChild(productElement);
    });
};

// Handle Add to Cart and Size Selection
listProductHTML.addEventListener('click', (event) => {
    const clickedElement = event.target;


    if (clickedElement.classList.contains('size-button')) {
        const parentItem = clickedElement.closest('.item');
        const priceDiv = parentItem.querySelector('.price');
        const selectedPrice = clickedElement.dataset.price;


        // Update price based on selected size
        priceDiv.textContent = `Kes ${selectedPrice}`;
        parentItem.dataset.selectedPrice = selectedPrice;
        parentItem.dataset.selectedSize = clickedElement.dataset.size;
    }


    if (clickedElement.classList.contains('addCart')) {
        const parentItem = clickedElement.closest('.item');
        const productId = parentItem.dataset.id;


        // Use stored or default values for price and size
        const selectedPrice = parentItem.dataset.selectedPrice || parentItem.querySelector('.price').textContent.replace('Kes ', '');
        const selectedSize = parentItem.dataset.selectedSize || 'default';


        addToCart(productId, selectedPrice, selectedSize);
    }
});

// Add product to cart
const addToCart = (productId, selectedPrice, selectedSize) => {
    const product = listProducts.find(item => item.id == productId);
    if (product) {
        const existingCartItem = carts.find(cart => cart.id === productId && cart.selectedSize === selectedSize);
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            const productToAdd = { ...product, selectedPrice, selectedSize, quantity: 1 };
            carts.push(productToAdd);
        }
        updateCartDisplay();
    } else {
        console.error("Product not found for ID:", productId);
    }
};

// Update cart display
const updateCartDisplay = () => {
    listCartHTML.innerHTML = ""; // Clear existing cart content
    carts.forEach(cartItem => {
        const cartElement = document.createElement('div');
        cartElement.classList.add('item');
        cartElement.innerHTML = `
            <div class="image">
                <img src="${cartItem.image}" alt="${cartItem.name}">
            </div>
            <h4>${cartItem.name}</h4>
            <div>Kes ${cartItem.selectedPrice}</div>
            <div>Size: ${cartItem.selectedSize}</div>
            <div class="quantity" style="display: flex; justify-content: center; align-items: center;">
                <span class="minus" data-id="${cartItem.id}" data-size="${cartItem.selectedSize}">-</span>
                <span class="quantity-value">${cartItem.quantity}</span>
                <span class="plus" data-id="${cartItem.id}" data-size="${cartItem.selectedSize}">+</span>
            </div>
        `;
        listCartHTML.appendChild(cartElement);
    });
    iconCartSpan.textContent = carts.length; // Update cart item count
};

// Handle quantity changes
listCartHTML.addEventListener('click', (event) => {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('plus') || clickedElement.classList.contains('minus')) {
        const productId = clickedElement.dataset.id;
        const size = clickedElement.dataset.size;
        const cartItem = carts.find(cart => cart.id === productId && cart.selectedSize === size);


        if (cartItem) {
            if (clickedElement.classList.contains('plus')) {
                cartItem.quantity += 1;
            } else if (clickedElement.classList.contains('minus')) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                } else {
                    // Remove item from cart if quantity is 1 and minus button is clicked
                    const cartItemIndex = carts.findIndex(cart => cart.id === productId && cart.selectedSize === size);
                    carts.splice(cartItemIndex, 1);
                }
            }
        }


        updateCartDisplay();
    }
});

// Search functionality
const handleSearch = () => {
    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-button");


    searchButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        const query = searchBar.value.toLowerCase();
        const filteredProducts = listProducts.filter(product =>
            product.name.toLowerCase().includes(query)
        );


        if (filteredProducts.length === 0) {
            listProductHTML.innerHTML = `<p style="text-align: center; color: gray;">No products found matching "${query}"</p>`;
        } else {
            renderProducts(filteredProducts);
        }
    });
};

// Fetch product data and initialize the application
const initApp = () => {
    fetch('furniture.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            listProducts = data;
            renderProducts();
            handleSearch();
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
};





