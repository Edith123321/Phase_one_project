const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close');
const body = document.querySelector('body');
const listProductHTML = document.querySelector('.listProduct');
const listCartHTML = document.querySelector('.listCart')
let iconCartSpan = document.querySelector('.icon-cart span ')

let listProducts = [];
let carts =[];

// Toggle cart visibility
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// Render products into the HTML
const AddDataToHtml = () => {
    listProductHTML.innerHTML = ""; // Clear existing content
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;

            // Default size and price (first dimension)
            const defaultSize = product.dimensions[0];
            const defaultPrice = defaultSize.price;

            // Create product HTML
            newProduct.innerHTML = `
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
                <button class="addCart" style="margin: 20px 100px;">
                    Add to cart
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Handle Add to Cart and Size Selection
listProductHTML.addEventListener('click', (event) => {
    const clickedElement = event.target;

    // Handle size selection
    if (clickedElement.classList.contains('size-button')) {
        const parentItem = clickedElement.closest('.item');
        const priceDiv = parentItem.querySelector('.price');
        const selectedPrice = clickedElement.dataset.price;

        // Update price based on selected size
        priceDiv.textContent = `Kes ${selectedPrice}`;
    }

    // Handle Add to Cart button click
    if (clickedElement.classList.contains('addCart')) {
        let product_id = clickedElement.parentElement.dataset.id;
        addToCart(product_id);

        // Find the product
        const product = listProducts.find(item => item.id == productId);
        if (product) {
            const selectedSize = parentItem.querySelector('.dimensions .size-button[data-price]').dataset.size || product.dimensions[0].size;
            const selectedPrice = parentItem.querySelector('.price').textContent.replace('Kes ', '');
            console.log(`Added to cart: ${product.name}, Size: ${selectedSize}, Price: Kes ${selectedPrice}`);
            // Add logic to manage the cart here
        }
    }
});
const addToCart = (product_id)=>{
    if(carts.length <= 0){

    }
}

function handleSearch() {
    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-button");


    searchButton.addEventListener("click", () => {
        const query = searchBar.value.toLowerCase();
        document.querySelector(".listProduct").innerHTML = ""; // Clear previous results


        fetch('http://localhost:3000/furniture')
            .then((response) => response.json())
            .then((films) => {
                const filteredFurniture = product.filter((furniture) =>
                    product.name.toLowerCase().includes(query)
                );


                if (filteredFurniture.length === 0) {
                    document.querySelector("#container").innerHTML = `
                        <p style="text-align: center; color: gray;">No films found matching "${query}"</p>`;
                } else {
                    filteredFurniture.forEach((data) => AddDataToHtml(product));
                }
            })
            .catch((error) => {
                console.error("Error fetching films:", error);
                alert("An error occurred while searching.");
            });
    });
}

// Fetch product data and initialize the application
const initApp = () => {
    fetch('http://localhost:3000/furniture')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            listProducts = data;
            console.log("Fetched products:", listProducts);
            AddDataToHtml();
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
        });
};

// Initialize the app
initApp();
function initialize(){
    handleSearch()
}

