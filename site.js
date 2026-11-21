const pageFiles = {
    home: "index.html",
    store: "store.html",
    wishlist: "wishlist.html",
    account: "account.html",
    profile: "profile.html",
    "shipping-returns": "shipping-returns.html",
    "size-guide-page": "size-guide.html",
    faq: "faq.html",
    contact: "contact.html",
    "gift-cards": "gift-cards.html",
    "our-story": "our-story.html",
    sustainability: "sustainability.html",
    careers: "careers.html",
    press: "press.html",
    "the-founder": "the-founder.html",
    "the-final-edition": "the-final-edition.html",
    gallery: "gallery.html",
    lookbook: "lookbook.html",
    "product-detail": "product-detail.html",
    checkout: "checkout.html"
};

const products = [
    { id: 1, name: "CHERISH THE MOMENT VERSE", price: 76500, img: "./images/placeholder-product.svg" },
    { id: 2, name: "CHERISH THE MOMENT VERSE", price: 76500, img: "./images/placeholder-product.svg" },
    { id: 3, name: "ILLUSTRATED HUG T-SHIRTS", price: 72800, img: "./images/placeholder-product.svg" },
    { id: 4, name: "LOVE Statement T-Shirt", price: 85400, img: "./images/placeholder-product.svg" },
    { id: 5, name: "THE HESED INSPIRATIONAL TSHIRT", price: 72800, img: "./images/placeholder-product.svg" },
    { id: 6, name: "THE QUARTET'S LAUGHTER TSHIRT", price: 76500, img: "./images/placeholder-product.svg" },
    { id: 7, name: "THE TRIPLE L VERSE", price: 76500, img: "./images/placeholder-product.svg" },
    { id: 8, name: "THE TRIPLE L VERSE", price: 76500, img: "./images/placeholder-product.svg" }
];

function readState(key, fallback) {
    const value = localStorage.getItem("kasmarte_" + key);
    return value ? JSON.parse(value) : fallback;
}

function saveState(key, value) {
    localStorage.setItem("kasmarte_" + key, JSON.stringify(value));
}

function navigate(page, query) {
    const file = pageFiles[page] || pageFiles.home;
    window.location.href = file + (query || "");
}

window.showPage = navigate;
window.showToast = function (message) {
    const toast = document.getElementById("auth-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("opacity-0", "pointer-events-none");
    window.setTimeout(() => toast.classList.add("opacity-0", "pointer-events-none"), 3000);
};

window.toggleFooterMenu = function (button) {
    if (window.innerWidth >= 768) return;
    const menu = button.nextElementSibling;
    const plus = button.querySelector(".plus-rotate");
    if (!menu || !plus) return;
    menu.classList.toggle("collapsed");
    plus.classList.toggle("open");
    plus.style.transform = menu.classList.contains("collapsed") ? "rotate(0deg)" : "rotate(45deg)";
};

document.addEventListener("DOMContentLoaded", function () {
    let isLoggedIn = readState("isLoggedIn", false);
    let cart = readState("cart", []);
    let wishlist = readState("wishlist", []);
    let userProfile = readState("profile", { firstName: "User", lastName: "Name", email: "", address: "" });
    const money = value => "₦" + Number(value).toLocaleString();
    const flash = sessionStorage.getItem("kasmarte_flash");
    if (flash) {
        sessionStorage.removeItem("kasmarte_flash");
        window.showToast(flash);
    }

    function updateCounts() {
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.textContent = cart.length;
            cartCount.classList.toggle("opacity-0", cart.length === 0);
        }
        const wishlistCount = document.getElementById("wishlist-count");
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
            wishlistCount.classList.toggle("opacity-0", wishlist.length === 0);
        }
    }

    function navigateFromLink(page) {
        if (page === "account" && isLoggedIn) {
            navigate("profile");
            return;
        }
        if (page === "wishlist" && !isLoggedIn) {
            sessionStorage.setItem("kasmarte_flash", "Please log in first.");
            navigate("account");
            return;
        }
        navigate(page);
    }

    document.querySelectorAll("[data-nav]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            navigateFromLink(link.getAttribute("data-nav"));
        });
    });

    const menu = document.getElementById("new-menu-overlay");
    const menuToggle = document.getElementById("menu-toggle-btn");
    const iconPlus = document.getElementById("icon-plus");
    const iconMinus = document.getElementById("icon-minus");
    if (menu && menuToggle) {
        menuToggle.addEventListener("click", () => {
            const open = menu.classList.toggle("menu-open");
            if (iconPlus) iconPlus.classList.toggle("opacity-0", open);
            if (iconMinus) iconMinus.classList.toggle("opacity-0", !open);
        });
    }

    const storeGrid = document.getElementById("store-grid");
    if (storeGrid) {
        storeGrid.innerHTML = products.map(product => `
            <div class="product-card store-item group cursor-pointer relative" data-name="${product.name.toLowerCase()}" data-price="${product.price}" data-id="${product.id}">
                <button class="wishlist-btn absolute top-3 right-3 z-20 text-gray-400 hover:text-ai-accent transition-all p-2 rounded-full bg-white bg-opacity-80" aria-label="Add ${product.name} to wishlist">
                    <svg class="h-6 w-6 heart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
                <div class="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-[3/4]"><img src="${product.img}" alt="${product.name}" class="w-full h-full object-cover grayscale group-hover:grayscale-0"></div>
                <h4 class="font-body font-bold text-lg">${product.name}</h4><p class="opacity-70">${money(product.price)}</p>
            </div>`).join("");
    }

    const search = document.getElementById("store-search");
    if (search) {
        search.addEventListener("input", () => {
            const term = search.value.trim().toLowerCase();
            document.querySelectorAll(".store-item").forEach(card => {
                card.classList.toggle("hidden", !card.dataset.name.includes(term));
            });
        });
    }

    function updateWishlistButton(button, product) {
        if (!isLoggedIn) {
            sessionStorage.setItem("kasmarte_flash", "Please log in to save wishlist items.");
            navigate("account");
            return;
        }
        const index = wishlist.findIndex(item => item.id === product.id);
        if (index >= 0) {
            wishlist.splice(index, 1);
            button.classList.remove("text-ai-accent");
            button.classList.add("text-gray-400");
            button.querySelector("svg").classList.remove("heart-filled");
        } else {
            wishlist.push(product);
            button.classList.add("text-ai-accent");
            button.classList.remove("text-gray-400");
            button.querySelector("svg").classList.add("heart-filled");
        }
        saveState("wishlist", wishlist);
        updateCounts();
    }

    document.addEventListener("click", event => {
        const wishlistButton = event.target.closest(".wishlist-btn");
        if (wishlistButton) {
            event.preventDefault();
            event.stopPropagation();
            const card = wishlistButton.closest(".store-item");
            const product = products.find(item => item.id === Number(card.dataset.id));
            if (product) updateWishlistButton(wishlistButton, product);
            return;
        }
        const productCard = event.target.closest(".store-item");
        if (productCard) {
            navigate("product-detail", "?id=" + encodeURIComponent(productCard.dataset.id));
        }
    });

    const wishlistContainer = document.getElementById("wishlist-container");
    if (wishlistContainer) {
        wishlistContainer.innerHTML = wishlist.length
            ? wishlist.map(item => `<a href="product-detail.html?id=${encodeURIComponent(item.id)}" class="product-card group"><div class="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-[3/4]"><img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover"></div><h4 class="font-body font-bold text-lg">${item.name}</h4><p class="opacity-70">${money(item.price)}</p></a>`).join("")
            : '<div class="col-span-full text-center text-gray-500 py-20">Your wishlist is empty.</div>';
    }

    const detailImage = document.getElementById("detail-image");
    if (detailImage) {
        const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;
        const product = products.find(item => item.id === id) || products[0];
        const title = document.getElementById("detail-title");
        const price = document.getElementById("detail-price");
        const breadcrumb = document.getElementById("detail-breadcrumb-name");
        detailImage.src = product.img;
        detailImage.alt = product.name;
        if (title) title.textContent = product.name;
        if (price) price.textContent = money(product.price);
        if (breadcrumb) breadcrumb.textContent = product.name;
        const related = document.getElementById("related-products-container");
        if (related) {
            related.innerHTML = products.filter(item => item.id !== id).slice(0, 4).map(item =>
                `<a href="product-detail.html?id=${item.id}" class="product-card group"><div class="bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-[3/4]"><img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover"></div><h4 class="font-body font-bold text-lg">${item.name}</h4><p class="opacity-70">${money(item.price)}</p></a>`
            ).join("");
        }
        const addButton = document.getElementById("add-to-cart-btn");
        if (addButton) addButton.addEventListener("click", () => {
            if (!isLoggedIn) {
                sessionStorage.setItem("kasmarte_flash", "Please log in to add to cart.");
                navigate("account");
                return;
            }
            const selectedSize = document.querySelector('input[name="size"]:checked');
            cart.push({ ...product, size: selectedSize ? selectedSize.id.replace("size-", "").toUpperCase() : "M" });
            saveState("cart", cart);
            updateCounts();
            window.showToast("Added to Cart");
        });
        const detailWishlist = document.getElementById("detail-wishlist-btn");
        if (detailWishlist) detailWishlist.addEventListener("click", () => updateWishlistButton(detailWishlist, product));
    }

    function renderProfile() {
        const name = document.getElementById("sidebar-name");
        const avatar = document.getElementById("profile-avatar");
        const first = document.getElementById("p-firstname");
        const last = document.getElementById("p-lastname");
        const email = document.getElementById("p-email");
        const address = document.getElementById("p-address");
        if (name) name.textContent = userProfile.firstName + " " + userProfile.lastName;
        if (avatar) avatar.textContent = (userProfile.firstName || "K").charAt(0);
        if (first) first.value = userProfile.firstName || "";
        if (last) last.value = userProfile.lastName || "";
        if (email) email.value = userProfile.email || "";
        if (address) address.value = userProfile.address || "";
    }
    renderProfile();

    const profileForm = document.getElementById("profile-form");
    if (profileForm) profileForm.addEventListener("submit", event => {
        event.preventDefault();
        userProfile = {
            firstName: document.getElementById("p-firstname").value,
            lastName: document.getElementById("p-lastname").value,
            email: document.getElementById("p-email").value,
            address: document.getElementById("p-address").value
        };
        saveState("profile", userProfile);
        renderProfile();
        window.showToast("Profile Updated!");
    });

    const loginForm = document.querySelector("#login-form-container form");
    if (loginForm) loginForm.addEventListener("submit", event => {
        event.preventDefault();
        isLoggedIn = true;
        saveState("isLoggedIn", true);
        window.showToast("Logged in successfully!");
        window.setTimeout(() => navigate("profile"), 400);
    });
    const signupForm = document.querySelector("#signup-form-container form");
    if (signupForm) signupForm.addEventListener("submit", event => {
        event.preventDefault();
        const inputs = signupForm.querySelectorAll("input");
        const fullName = inputs[0].value.trim().split(/\s+/);
        userProfile = {
            firstName: fullName.shift() || "User",
            lastName: fullName.join(" "),
            email: inputs[1].value,
            address: ""
        };
        saveState("profile", userProfile);
        isLoggedIn = true;
        saveState("isLoggedIn", true);
        navigate("profile");
    });
    const showSignup = document.getElementById("go-to-signup");
    if (showSignup) showSignup.addEventListener("click", () => {
        document.getElementById("login-form-container").classList.add("hidden");
        document.getElementById("signup-form-container").classList.remove("hidden");
    });
    const showLogin = document.getElementById("go-to-login");
    if (showLogin) showLogin.addEventListener("click", () => {
        document.getElementById("signup-form-container").classList.add("hidden");
        document.getElementById("login-form-container").classList.remove("hidden");
    });
    const logout = document.getElementById("logout-btn");
    if (logout) logout.addEventListener("click", () => {
        isLoggedIn = false;
        saveState("isLoggedIn", false);
        navigate("home");
    });

    function renderCheckout() {
        const container = document.getElementById("checkout-items-container");
        if (!container) return;
        const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
        container.innerHTML = cart.length ? cart.map((item, index) => `
            <div class="flex gap-4 border-b border-gray-100 pb-4 relative group">
                <div class="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0"><img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover"></div>
                <div class="flex-grow"><p class="font-bold text-sm pr-6">${item.name}</p><p class="text-xs text-gray-500">Size: ${item.size}</p><p class="text-sm font-bold mt-1 text-ai-accent">${money(item.price)}</p></div>
                <button type="button" data-remove-cart="${index}" class="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-500" aria-label="Remove item">×</button>
            </div>`).join("") : '<div class="text-center text-gray-400 py-4">Your cart is empty</div>';
        const totalElement = document.getElementById("checkout-total");
        if (totalElement) totalElement.textContent = money(total);
    }
    renderCheckout();
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        saveState("cart", cart);
        updateCounts();
        renderCheckout();
    };
    document.querySelectorAll("[data-remove-cart]").forEach(button => {
        button.addEventListener("click", () => window.removeFromCart(Number(button.dataset.removeCart)));
    });

    const cartButton = document.getElementById("cart-btn");
    if (cartButton) cartButton.addEventListener("click", () => {
        if (!isLoggedIn) {
            sessionStorage.setItem("kasmarte_flash", "Please log in.");
            navigate("account");
        } else {
            navigate("checkout");
        }
    });
    const placeOrder = document.getElementById("place-order-btn");
    if (placeOrder) placeOrder.addEventListener("click", () => {
        if (!cart.length) {
            window.showToast("Cart is empty");
            return;
        }
        cart = [];
        saveState("cart", cart);
        updateCounts();
        renderCheckout();
        const modal = document.getElementById("success-modal");
        if (modal) modal.classList.replace("hidden-modal", "visible-modal");
    });
    const closeSuccess = document.getElementById("close-success-modal");
    if (closeSuccess) closeSuccess.addEventListener("click", () => {
        document.getElementById("success-modal").classList.replace("visible-modal", "hidden-modal");
        navigate("store");
    });

    const sizeModal = document.getElementById("size-guide-modal");
    const sizeTrigger = document.getElementById("size-guide-trigger");
    const closeSize = document.getElementById("close-size-guide");
    if (sizeModal && sizeTrigger) sizeTrigger.addEventListener("click", () => sizeModal.classList.replace("hidden-modal", "visible-modal"));
    if (sizeModal && closeSize) closeSize.addEventListener("click", () => sizeModal.classList.replace("visible-modal", "hidden-modal"));

    const aiModal = document.getElementById("ai-tryon-modal");
    const aiTrigger = document.getElementById("ai-trigger-btn");
    const aiClose = document.getElementById("close-ai-modal");
    const aiInput = document.getElementById("ai-file-input");
    if (aiModal && aiTrigger && aiInput) {
        aiTrigger.addEventListener("click", () => {
            if (!isLoggedIn) {
                sessionStorage.setItem("kasmarte_flash", "Log in to use AI.");
                navigate("account");
                return;
            }
            document.getElementById("ai-step-upload").classList.remove("hidden");
            document.getElementById("ai-step-processing").classList.add("hidden");
            document.getElementById("ai-step-result").classList.add("hidden");
            aiModal.classList.replace("hidden-modal", "visible-modal");
        });
        if (aiClose) aiClose.addEventListener("click", () => aiModal.classList.replace("visible-modal", "hidden-modal"));
        aiInput.addEventListener("change", () => {
            const file = aiInput.files && aiInput.files[0];
            if (!file) return;
            document.getElementById("ai-step-upload").classList.add("hidden");
            document.getElementById("ai-step-processing").classList.remove("hidden");
            document.getElementById("ai-user-preview").src = URL.createObjectURL(file);
            window.setTimeout(() => {
                const sizes = ["S", "M", "L", "XL", "XXL"];
                const index = (file.size + file.name.length) % sizes.length;
                document.getElementById("ai-sizing-result").innerHTML = `<p class="text-xs uppercase text-gray-500 font-bold">Detected Build</p><p class="text-base font-bold">Regular</p><p class="text-xs uppercase text-gray-500 font-bold mt-4">Recommended Size</p><p id="ai-rec-size" class="text-4xl font-header-dramatic font-bold text-ai-accent">${sizes[index]}</p><p class="mt-4 text-sm italic text-gray-600">A suggested fit based on the selected image.</p>`;
                document.getElementById("ai-step-processing").classList.add("hidden");
                document.getElementById("ai-step-result").classList.remove("hidden");
            }, 1200);
        });
        const tryAnother = document.getElementById("ai-try-another");
        if (tryAnother) tryAnother.addEventListener("click", () => {
            document.getElementById("ai-step-result").classList.add("hidden");
            document.getElementById("ai-step-upload").classList.remove("hidden");
        });
        const addRecommended = document.getElementById("ai-add-to-cart");
        if (addRecommended) addRecommended.addEventListener("click", () => {
            const size = document.getElementById("ai-rec-size");
            const product = products.find(item => item.name === document.getElementById("ai-product-name-display").textContent) || products[0];
            if (size) {
                cart.push({ ...product, size: size.textContent });
                saveState("cart", cart);
                updateCounts();
            }
            aiModal.classList.replace("visible-modal", "hidden-modal");
            window.showToast("Added recommended size to cart!");
        });
    }

    updateCounts();
    const brandText = document.getElementById("brand-text");
    if (brandText) window.addEventListener("scroll", () => {
        brandText.textContent = window.scrollY > 50 ? "K" : "KASMARTE";
    });
});
