const checkoutForm = document.getElementById("checkoutForm");
const customerNameInput = document.getElementById("customerName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantity");
const totalInput = document.getElementById("total");
const checkoutMessage = document.getElementById("checkoutMessage");

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function loadProductsIntoSelect() {
  const products = getProducts();
  productSelect.innerHTML = '<option value="">-- Select a perfume --</option>';

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} - ${formatCurrency(product.price)}`;
    option.dataset.price = product.price;
    productSelect.appendChild(option);
  });

  const preselectedProductId = getQueryParam("productId");
  if (preselectedProductId) {
    productSelect.value = preselectedProductId;
  }
}

function calculateTotal() {
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const price = selectedOption ? Number(selectedOption.dataset.price || 0) : 0;
  const quantity = Number(quantityInput.value || 0);
  const total = price * quantity;
  totalInput.value = formatCurrency(total > 0 ? total : 0);
  return total;
}

function submitOrder(event) {
  event.preventDefault();

  const customerName = customerNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const productId = productSelect.value;
  const quantity = Number(quantityInput.value);

  const products = getProducts();
  const selectedProduct = products.find((item) => item.id === productId);
  const total = calculateTotal();

  if (!customerName || !email || !phone || !address || !selectedProduct || quantity < 1) {
    checkoutMessage.textContent = "Please fill all required fields correctly.";
    checkoutMessage.style.color = "#dc2626";
    return;
  }

  const orders = getOrders();
  orders.push({
    id: Date.now().toString(),
    customerName,
    email,
    phone,
    address,
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    unitPrice: selectedProduct.price,
    quantity,
    total,
    createdAt: new Date().toISOString()
  });
  saveOrders(orders);

  checkoutForm.reset();
  totalInput.value = formatCurrency(0);
  checkoutMessage.textContent = "Order placed successfully.";
  checkoutMessage.style.color = "#059669";
}

productSelect.addEventListener("change", calculateTotal);
quantityInput.addEventListener("input", calculateTotal);
checkoutForm.addEventListener("submit", submitOrder);

ensureDefaultProducts();
loadProductsIntoSelect();
calculateTotal();
