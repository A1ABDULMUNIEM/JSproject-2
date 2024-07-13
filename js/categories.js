class Categories {
    constructor() {
        this.apiURL = 'https://dummyjson.com/';
    }

    getAllCategories() {
        fetch(this.apiURL + 'products/categories')
            .then(res => res.json())
            .then(productCategories => {
                console.log('Product Categories:', productCategories);

                return fetch(this.apiURL + 'products/category-list')
                    .then(res => res.json())
                    .then(categoryList => {
                        console.log('Category List:', categoryList);

                        const categoriesContainer = document.querySelector(".categories");
                        categoryList.forEach(category => {
                            const categoryElement = document.createElement('a');
                            categoryElement.className = 'dropdown-item';
                            categoryElement.href = `/category.html?category=${category}`;
                            categoryElement.textContent = toTitleCase(category);
                            categoriesContainer.appendChild(categoryElement);
                        });
                    });
            });
    }

    getSingleCategory(category) {
        fetch(this.apiURL + 'products/category/' + category)
            .then(res => res.json())
            .then(data => {
                console.log('Response for category', category, ':', data);

                const products = data.products;
                console.log('Products in category', category, ':', products);
                const productContainer = document.querySelector(".products");

                products.forEach(product => {
                    const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.thumbnail;
                    const encodedProductId = encodeURIComponent(product.id);

                    const productElement = document.createElement('div');
                    productElement.className = 'product';
                    productElement.innerHTML = `
                        <h3><a href="/product.html?productId=${encodedProductId}">${product.title}</a></h3>
                        <img src="${imageUrl}" alt="${product.title}" style="max-width: 20%; height: auto;" />
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    `;
                    productContainer.appendChild(productElement);
                });
            });
    }
}