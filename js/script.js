document.addEventListener("DOMContentLoaded", function() {
    loadScript('js/categories.js', categoriesSetup);
    loadScript('js/products.js', productsSetup);
    loadScript('js/user.js', userSetup);
});

fetch("/templates/navigation.html")
    .then(response => response.text())
    .then(data => {
        if (document.querySelector(".logout")) {
            localStorage.clear();
        }
            document.getElementById("nav-placeholder").outerHTML = data;
            const accountNav = document.querySelector(".accountNav");
            if (localStorage.getItem("user") === null) {
                accountNav.innerHTML = '<li class="nav-item"><a class="nav-link text-white" href="/login.html">Login</a> </li>';
            } else {
                accountNav.innerHTML =
                    '<li class="nav-item"><a class="nav-link text-white" href="/account.html">Account</a></li>' +
                    '<li class="nav-item"><a class="nav-link text-white" href="/logout.html">Log Out</a></li>' +
                    '<li class="nav-item"><a class="nav-link text-white" href="/cart.html">' +
                    '<i class="fa-solid fa-cart-shopping"></i>' +
                    '<span class="cartCount badge bg-primary ms-2"></span></a></li>';
            }
        });

fetch("/templates/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer-placeholder").outerHTML = data;
    });

var categoriesSetup = function() {
    let categories = new Categories();
    categories.getAllCategories();
    if(urlParam("category")){
        categories.getSingleCategory(decodeURIComponent(urlParam("category")));
    }
}

var productsSetup = function() {
    let products = new Products();
    if (document.querySelector(".products.new")) {
        products.getNewProducts(3);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (productId) {
        products.getSingleProduct(productId);
    }

    const searchForm = document.querySelector("#search__form");
    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const searchQuery = document.querySelector("#search__input").value;
            products.searchProducts(searchQuery);  
        });
    }
    
    if (document.querySelector(".cart-items")) {
        products.displayCartItems();
    }
}

var userSetup = function() {
    let user = new User();

    const loginForm = document.querySelector('form.login');
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var username = document.querySelector('#username').value;
            var password = document.querySelector('#password').value;
            user.doLogin(username, password);
        });
    }

    if (document.querySelector('.userAccount')) {
        user.checkLogin();
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            user.logout();
        });
    }

    if (window.location.pathname === '/logout.html') {
        user.checkLogoutPageAccess();
    }
}



function loadScript(url, callback) {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s|-)\w/g, function(match) {
        return match.toUpperCase();
    }).replace(/-/g, ' ');
}

function urlParam(name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
    return results ? results[1] || 0 : null;
}
