class Products {
    constructor() {
        this.apiURL = 'https://dummyjson.com/';
    }

    getNewProducts(limit) {
        fetch(this.apiURL + 'products?limit=' + limit + '&&sortBy=id&order=desc')
            .then(res => res.json())
            .then(data => {
                console.log('Response:', data);

                const products = data.products;
                console.log('Newest products:', products);
                const productContainer = document.querySelector(".products.new");
                
                products.forEach(product => {
                    const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.thumbnail;
                    const encodedProductId = encodeURIComponent(product.id);

                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.style = 'display: inline-block; width: 30%; margin: 10px; padding: 10px; border: 1px solid #ccc;';
                    productElement.innerHTML = `
                        <h3><a href="/product.html?productId=${encodedProductId}">${product.title}</a></h3>
                        <img src="${imageUrl}" alt="${product.title}" style="max-width: 100%; height: auto;"/>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    `;
                    productContainer.appendChild(productElement);
                });
            })
    }

    getSingleProduct(id) {
        fetch(this.apiURL + 'products/' + id)
            .then(res => res.json())
            .then(data => {
                document.querySelector(".product_image").innerHTML = `<img src="${data.images[0]}" class="img-fluid" alt="${data.title}">`;
                document.querySelector(".product_title").textContent = data.title;
                document.querySelector(".product_price").textContent = "$" + data.price.toFixed(2);
                document.querySelector(".product_description").innerHTML = "<p>" + data.description + "</p>";
                document.querySelector(".btn-success").addEventListener("click", () => this.addToCart(data));

            });
    }

    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            product.quantity = 1; 
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.title} has been added to the cart.`);
    }

    searchProducts(keyword) {
        fetch(this.apiURL + 'products/search?q=' + encodeURIComponent(keyword))
            .then(res => res.json())
            .then(data => {
                console.log('Search Results for keyword', keyword, ':', data);

                const products = data.products;
                const productContainer = document.querySelector(".products");

                productContainer.innerHTML = ''; 

                products.forEach(product => {
                    const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.thumbnail;
                    const encodedProductId = encodeURIComponent(product.id);

                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.style = 'display: inline-block; width: 30%; margin: 10px; padding: 10px; border: 1px solid #ccc;';
                    productElement.innerHTML = `
                        <h3><a href="/product.html?productId=${encodedProductId}">${product.title}</a></h3>
                        <img src="${imageUrl}" alt="${product.title}" style="max-width: 100%; height: auto;"/>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    `;
                    productContainer.appendChild(productElement);
                });
            })
        }
    
    displayCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.querySelector(".cart-items");

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartContainer.innerHTML = "";
            cart.forEach(product => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.style = 'display: flex; align-items: center; margin: 10px 0;';
                cartItemElement.innerHTML = `
                    <img src="${product.images[0]}" alt="${product.title}" style="max-width: 100px; height: auto; margin-right: 20px;">
                    <div>
                        <h3>${product.title}</h3>
                        <p>Price: $${product.price.toFixed(2)}</p>
                    </div>
                `;
                cartContainer.appendChild(cartItemElement);
            });
        }
    }
}

