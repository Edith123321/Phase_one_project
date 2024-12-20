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
