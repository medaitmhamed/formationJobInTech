const products = [
  {
    id: 1,
    name: "Phone",
    price: 300,
  },
  {
    id: 2,
    name: "Smart TV",
    price: 220,
  },
  {
    id: 3,
    name: "Gaming Console",
    price: 150,
  },
];

let shoppingCart = [];
const discountThreshold = 400;
const discountRate = 0.1;

// get DOM elements
const productsContainer = document.getElementById("products-list");
const cartContainer = document.getElementById("cart-items");
const totalContainer = document.getElementById("total-section");
const messageContainer = document.getElementById("payment-message");


// display messages
const displayMessage = (message, type) => {
  messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
  setTimeout(() => {
    messageContainer.innerHTML = "";
  }, 5000);
};

const addItem = (itemId) => {
  const product = products.find((p) => p.id === parseInt(itemId));
  if (product) {
    const existingItem = shoppingCart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.count++;
    } else {
      shoppingCart.push({ ...product, count: 1 });
    }
    displayMessage(`✅ ${product.name} added to cart!`, "success");
    renderCart();
    renderTotal();
  } else {
    return;
  }
};

const removeItem = (itemId) => {
  const itemIndex = shoppingCart.findIndex(
    (item) => item.id === parseInt(itemId)
  );
  if (itemIndex > -1) {
    const removedItem = shoppingCart[itemIndex];
    shoppingCart.splice(itemIndex, 1);
    displayMessage(`🗑️ ${removedItem.name} removed from cart!`, "info");
    renderCart();
    renderTotal();
  }
};

const updateItemCount = (itemId, newCount) => {
  const item = shoppingCart.find((item) => item.id === parseInt(itemId));
  if (item) {
    if (newCount === "" || isNaN(newCount)) {
        item.count = 1;
    } else{
    item.count = parseInt(newCount);
    }
  }
  renderCart();
  renderTotal();
};

const calculateTotalPrice = () => {
  let total = 0;
  for (const item of shoppingCart) {
    total += item.price * item.count;
  }
  return total;
};

const pay = (paymentAmount) => {
  if (shoppingCart.length === 0) {
    displayMessage("❌ Your cart is empty!", "error");
    return;
  }

  let totalPrice = calculateTotalPrice();
  let finalPrice = totalPrice;
  let discountApplied = false;

  if (totalPrice > discountThreshold) {
    finalPrice = totalPrice * (1 - discountRate);
    discountApplied = true;
  }

  if (paymentAmount >= finalPrice) {
    let change = paymentAmount - finalPrice;
    let message = `🎉 Thank you for your purchase!`;
    if (change > 0) {
      message += `<br>Your change: ${change.toFixed(2)}`;
    }

    displayMessage(message, "success");
    shoppingCart = []; // Clear cart after successful payment
    renderCart();
    renderTotal();
  } else {
    let shortfall = finalPrice - paymentAmount;
    console.log("Insufficient payment");
    displayMessage(
      `❌ Insufficient payment. You need ${shortfall.toFixed(2)} more.`,
      "error"
    );
  }
};

const renderProducts = () => {
  productsContainer.innerHTML = "";
  for (let product of products) {
    const productDiv = document.createElement("div");
    productDiv.className = "product-item";
    productDiv.innerHTML = `
                    <div class="product-info">
                        <span class="product-name">${product.name}</span>
                        <span class="product-price">${product.price}</span>
                    </div>
                    <button class="add-btn" onclick="addItem('${product.id}')">Add to Cart</button>
                `;
    productsContainer.appendChild(productDiv);
  }
};

const renderCart = () => {
  if (shoppingCart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart">
  <img src="empty-cart.png" alt="Empty Cart" width="150" /><br/>
  Your cart is <span>empty</span></div>`;
    return;
  }

  cartContainer.innerHTML = "";
  for (let item of shoppingCart) {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    const totalPrice = item.price * item.count;
    cartItemDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold;">${item.name}</span>
                        <span style="color: #27ae60;">${item.price}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="number" value="${item.count}" min="1" max="99" 
                               style="width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center;"
                               onchange="updateItemCount(${item.id}, this.value)">
                        <span style="font-weight: bold; color: #2c3e50;">${totalPrice}</span>
                        <button onclick="removeItem(${item.id})" 
                                style="background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            <img src="delete_icon.png" alt="Remove" width="25" />
                        </button>
                    </div>
                `;
    cartContainer.appendChild(cartItemDiv);
  }
};

const renderTotal = () => {
  if (shoppingCart.length === 0) {
    totalContainer.innerHTML = "";
    return;
  }

  document.getElementById("pay-btn").disabled = false;

  const subtotal = calculateTotalPrice();
  const discountApplied = subtotal > discountThreshold;
  const discount = discountApplied ? subtotal * discountRate : 0;
  const finalTotal = subtotal - discount;

  let totalHTML = `
                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
            `;

  if (discountApplied) {
    totalHTML += `
                    <div class="total-row">
                        <span>Discount (10%) <span class="discount-badge">APPLIED</span>:</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                `;
  }

  totalHTML += `
                    <div class="total-row final-total">
                        <span>Total:</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;

  totalContainer.innerHTML = totalHTML;
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  renderProducts();
  renderCart();
  renderTotal();

  document.getElementById("pay-btn").addEventListener("click", function () {
    const paymentAmount = parseFloat(
      document.getElementById("payment-amount").value
    );

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      displayMessage("❌ Please enter a valid payment amount", "error");
      return;
    }

    pay(paymentAmount);
    document.getElementById("payment-amount").value = "";
  });
});
