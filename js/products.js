const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const notesInput = document.getElementById("notes");
const imageUrlInput = document.getElementById("imageUrl");
const tableBody = document.getElementById("productTableBody");
const table = document.getElementById("productTable");
const emptyState = document.getElementById("emptyState");
const productGrid = document.getElementById("productGrid");
const searchFilter = document.getElementById("searchFilter");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");

function renderProducts() {
  const products = getProducts();
  tableBody.innerHTML = "";
  productGrid.innerHTML = "";

  const filteredProducts = getFilteredProducts(products);

  if (products.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.textContent = "No products added yet. Add products from the admin section below.";
    table.classList.add("hidden");
    return;
  }

  if (filteredProducts.length === 0) {
    emptyState.classList.remove("hidden");
    emptyState.textContent = "No products match selected filters.";
  } else {
    emptyState.classList.add("hidden");
  }

  table.classList.remove("hidden");
  populateCategoryFilter(products);

  filteredProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("data-action", "buy");
    card.setAttribute("data-id", product.id);
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.imageUrl || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-content">
        <h4>${product.name}</h4>
        <p class="product-meta">${product.category}</p>
        <p class="product-notes">${product.notes || "Premium fragrance blend"}</p>
        <div class="product-footer">
          <span class="product-price">${formatCurrency(product.price)}</span>
          <button class="btn action-btn" data-action="buy" data-id="${product.id}">Buy Now</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>${product.stock}</td>
      <td>${product.notes || "-"}</td>
      <td>
        <button class="btn btn-secondary action-btn" data-action="edit" data-id="${product.id}">Edit</button>
        <button class="btn action-btn" data-action="delete" data-id="${product.id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function getFilteredProducts(products) {
  const searchValue = searchFilter.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPrice = priceFilter.value;

  return products.filter((product) => {
    const searchMatch = product.name.toLowerCase().includes(searchValue);
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;

    let priceMatch = true;
    if (selectedPrice === "0-499") {
      priceMatch = Number(product.price) <= 499;
    } else if (selectedPrice === "500-999") {
      priceMatch = Number(product.price) >= 500 && Number(product.price) <= 999;
    } else if (selectedPrice === "1000+") {
      priceMatch = Number(product.price) >= 1000;
    }

    return searchMatch && categoryMatch && priceMatch;
  });
}

function populateCategoryFilter(products) {
  const currentValue = categoryFilter.value || "all";
  const categories = [...new Set(products.map((item) => item.category).filter(Boolean))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = categories.includes(currentValue) || currentValue === "all" ? currentValue : "all";
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  formTitle.textContent = "Add New Perfume";
  cancelEditBtn.classList.add("hidden");
}

function handleSubmit(event) {
  event.preventDefault();

  const id = productIdInput.value;
  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();
  const price = Number(priceInput.value);
  const stock = Number(stockInput.value);
  const notes = notesInput.value.trim();
  const imageUrl = imageUrlInput.value.trim();

  if (!name || !category || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
    alert("Please enter valid product details.");
    return;
  }

  const products = getProducts();

  if (id) {
    const index = products.findIndex((item) => item.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], name, category, price, stock, notes, imageUrl };
    }
  } else {
    products.push({
      id: Date.now().toString(),
      name,
      category,
      price,
      stock,
      notes,
      imageUrl
    });
  }

  saveProducts(products);
  renderProducts();
  resetForm();
}

function handleTableClick(event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;

  const action = actionElement.getAttribute("data-action");
  const id = actionElement.getAttribute("data-id");
  const products = getProducts();

  if (action === "edit") {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    productIdInput.value = product.id;
    nameInput.value = product.name;
    categoryInput.value = product.category;
    priceInput.value = product.price;
    stockInput.value = product.stock;
    notesInput.value = product.notes || "";
    imageUrlInput.value = product.imageUrl || "";
    formTitle.textContent = "Edit Perfume";
    cancelEditBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (action === "delete") {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    const updated = products.filter((item) => item.id !== id);
    saveProducts(updated);
    renderProducts();
  }

  if (action === "buy") {
    window.location.href = `checkout.html?productId=${encodeURIComponent(id)}`;
  }
}

function handleCardKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".product-card");
  if (!card) return;

  event.preventDefault();
  const id = card.getAttribute("data-id");
  if (id) {
    window.location.href = `checkout.html?productId=${encodeURIComponent(id)}`;
  }
}

function resetFilters() {
  searchFilter.value = "";
  categoryFilter.value = "all";
  priceFilter.value = "all";
  renderProducts();
}

productForm.addEventListener("submit", handleSubmit);
document.addEventListener("click", handleTableClick);
document.addEventListener("keydown", handleCardKeyboard);
cancelEditBtn.addEventListener("click", resetForm);
searchFilter.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
priceFilter.addEventListener("change", renderProducts);
resetFiltersBtn.addEventListener("click", resetFilters);

ensureDefaultProducts();
renderProducts();
