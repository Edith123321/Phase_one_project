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
