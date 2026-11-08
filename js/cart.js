// cart.js - cart page: quantities, promo code and placing an order (localStorage: "cart", "promo", "orders").

var PROMO_CODE = "STUDENT15";
var PROMO_PERCENT = 15;

function getSubtotal(cart) {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        var item = findItem(cart[i].id);
        if (item !== null) {
            total = total + item.price * cart[i].qty;
        }
    }
    return total;
}

function getDiscount(subtotal) {
    if (loadData("promo", null) === PROMO_CODE) {
        return Math.round(subtotal * PROMO_PERCENT / 100);
    }
    return 0;
}

function changeQuantity(id, change) {
    var cart = getCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty = cart[i].qty + change;
        }
        if (cart[i].qty > 0) {
            newCart.push(cart[i]);
        }
    }
    saveCart(newCart);
    showCart();
}

function removeFromCart(id) {
    var cart = getCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            newCart.push(cart[i]);
        }
    }
    saveCart(newCart);
    showCart();
}

function createCartRow(line, item) {
    var row = document.createElement("li");
    row.className = "list-group-item p-3";
    row.innerHTML =
        '<div class="d-flex align-items-center gap-3">' +
        '<img class="cart-img" width="72" height="72" alt="">' +
        '<div class="flex-grow-1">' +
        '<div class="fw-semibold cart-name"></div>' +
        '<div class="small text-body-secondary cart-price"></div>' +
        '</div>' +
        '<button type="button" class="btn btn-link btn-sm remove-btn">Remove</button>' +
        '</div>' +
        '<div class="d-flex justify-content-between align-items-center mt-3">' +
        '<div class="d-flex align-items-center gap-2">' +
        '<button type="button" class="btn btn-outline-secondary qty-btn minus">&minus;</button>' +
        '<span class="cart-qty" aria-live="polite"></span>' +
        '<button type="button" class="btn btn-outline-secondary qty-btn plus">+</button>' +
        '</div>' +
        '<strong class="cart-line-total"></strong>' +
        '</div>';

    var image = row.querySelector(".cart-img");
    image.src = item.image;
    image.style.objectPosition = item.focus;
    row.querySelector(".cart-name").textContent = item.name;
    row.querySelector(".cart-price").textContent = formatPrice(item.price) + " each";
    row.querySelector(".cart-qty").textContent = line.qty;
    row.querySelector(".cart-line-total").textContent = formatPrice(item.price * line.qty);

    var minus = row.querySelector(".minus");
    var plus = row.querySelector(".plus");
    var remove = row.querySelector(".remove-btn");
    minus.setAttribute("aria-label", "Decrease quantity of " + item.name);
    plus.setAttribute("aria-label", "Increase quantity of " + item.name);
    remove.setAttribute("aria-label", "Remove " + item.name + " from the cart");

    minus.addEventListener("click", function () { changeQuantity(item.id, -1); });
    plus.addEventListener("click", function () { changeQuantity(item.id, 1); });
    remove.addEventListener("click", function () { removeFromCart(item.id); });

    return row;
}

function showCart() {
    var cart = getCart();
    var list = document.getElementById("cart-list");
    list.innerHTML = "";

    var isEmpty = cart.length === 0;
    document.getElementById("cart-empty").hidden = !isEmpty;
    document.getElementById("cart-content").hidden = isEmpty;
    if (isEmpty) {
        return;
    }

    for (var i = 0; i < cart.length; i++) {
        var item = findItem(cart[i].id);
        if (item !== null) {
            list.appendChild(createCartRow(cart[i], item));
        }
    }

    var subtotal = getSubtotal(cart);
    var discount = getDiscount(subtotal);
    document.getElementById("sum-subtotal").textContent = formatPrice(subtotal);
    document.getElementById("sum-discount").textContent = "- " + formatPrice(discount);
    document.getElementById("sum-discount-row").hidden = discount === 0;
    document.getElementById("sum-total").textContent = formatPrice(subtotal - discount);

    // the promo form shows the current state
    var promoInput = document.getElementById("promo-input");
    var promoButton = document.getElementById("promo-btn");
    if (discount > 0) {
        promoInput.value = PROMO_CODE;
        promoInput.disabled = true;
        promoButton.textContent = "Remove";
    } else {
        promoInput.disabled = false;
        promoButton.textContent = "Apply";
    }
}

function setupPromo() {
    var form = document.getElementById("promo-form");
    var input = document.getElementById("promo-input");
    var message = document.getElementById("promo-message");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // the button works as "Remove" when the code is already applied
        if (loadData("promo", null) === PROMO_CODE) {
            removeData("promo");
            input.value = "";
            message.textContent = "Promo code removed.";
            showCart();
            return;
        }

        var code = input.value.trim().toUpperCase();
        if (code === "") {
            message.textContent = "Please enter a promo code.";
        } else if (code === PROMO_CODE) {
            saveData("promo", PROMO_CODE);
            message.textContent = "Promo code applied: " + PROMO_PERCENT + "% off.";
            showCart();
        } else {
            message.textContent = "This promo code is not valid.";
        }
    });
}

function placeOrder() {
    var user = getCurrentUser();
    var alertBox = document.getElementById("order-alert");

    if (user === null) {
        alertBox.hidden = false;
        return;
    }

    var cart = getCart();
    var subtotal = getSubtotal(cart);
    var discount = getDiscount(subtotal);
    var orderItems = [];

    for (var i = 0; i < cart.length; i++) {
        var item = findItem(cart[i].id);
        if (item !== null) {
            orderItems.push({ name: item.name, qty: cart[i].qty, price: item.price });
        }
    }

    var order = {
        id: "BC-" + String(Date.now()).slice(-6),
        email: user.email,
        date: new Date().toISOString(),
        items: orderItems,
        promo: discount > 0 ? PROMO_CODE : "",
        total: subtotal - discount
    };

    var orders = loadData("orders", []);
    orders.push(order);
    saveData("orders", orders);

    saveCart([]);
    removeData("promo");

    document.getElementById("cart-content").hidden = true;
    document.getElementById("cart-empty").hidden = true;
    document.getElementById("done-number").textContent = order.id;
    document.getElementById("done-total").textContent = formatPrice(order.total);
    document.getElementById("order-done").hidden = false;
    window.scrollTo(0, 0);
}

function setupCartPage() {
    setupPromo();
    showCart();

    document.getElementById("order-btn").addEventListener("click", placeOrder);

    document.getElementById("clear-btn").addEventListener("click", function () {
        saveCart([]);
        removeData("promo");
        document.getElementById("promo-input").value = "";
        document.getElementById("promo-message").textContent = "";
        showCart();
        showToast("Cart cleared.");
    });
}

document.addEventListener("DOMContentLoaded", setupCartPage);
