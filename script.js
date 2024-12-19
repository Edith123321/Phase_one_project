const iconCart = document.querySelector('.icon-cart');
        const closeCart = document.querySelector('.close');
        const body = document.querySelector('body');
        const listProductHTML = document.querySelector('.listProduct');
        const listCartHTML = document.querySelector('.listCart');
        let iconCartSpan = document.querySelector('.icon-cart span');

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
        const AddDataToHtml = (productList = listProducts) => {
            listProductHTML.innerHTML = ""; // Clear existing content
            productList.forEach(product => {
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
                    <button class="addCart">Add to cart</button>
                `;
                listProductHTML.appendChild(newProduct);
            });
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
                const parentItem = clickedElement.closest('.item');
                const productId = parentItem.dataset.id;
                addToCart(productId);
            }
        });

        const addToCart = (product_id) => {
            const product = listProducts.find(item => item.id == product_id);
            if (product) {
                carts.push(product);
                updateCartDisplay();
                console.log("Cart updated:", carts);
            } else {
                console.error("Product not found for ID:", product_id);
            }
        };

        const updateCartDisplay = () => {
            listCartHTML.innerHTML = ""; // Clear previous cart content
            carts.forEach(cartItem => {
                const cartElement = document.createElement('div');
                cartElement.textContent = `${cartItem.name} - Kes ${cartItem.dimensions[0].price}`;
                listCartHTML.appendChild(cartElement);
            });
            iconCartSpan.textContent = carts.length; // Update cart count
        };

        // Search functionality
        function handleSearch() {
            const searchBar = document.querySelector(".search-bar");
            const searchButton = document.querySelector(".search-button");

            searchButton.addEventListener("click", () => {
                const query = searchBar.value.toLowerCase();
                const filteredProducts = listProducts.filter(product =>
                    product.name.toLowerCase().includes(query)
                );

                if (filteredProducts.length === 0) {
                    listProductHTML.innerHTML = `<p style="text-align: center; color: gray;">No products found matching "${query}"</p>`;
                } else {
                    AddDataToHtml(filteredProducts);
                }
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
                    AddDataToHtml();
                    handleSearch();
                })
                .catch(error => {
                    console.error("Error fetching product data:", error);
                });
        };

        // Initialize the app
        initApp();
    