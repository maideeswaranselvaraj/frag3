const STORAGE_KEYS = {
  products: "perfume_products",
  orders: "perfume_orders",
  subscribers: "elora_subscribers"
};

function getProducts() {
  const raw = localStorage.getItem(STORAGE_KEYS.products);
  return raw ? JSON.parse(raw) : [];
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function getOrders() {
  const raw = localStorage.getItem(STORAGE_KEYS.orders);
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function formatCurrency(amount) {
  return "Rs. " + Number(amount).toFixed(2);
}

function getSubscribers() {
  const raw = localStorage.getItem(STORAGE_KEYS.subscribers);
  return raw ? JSON.parse(raw) : [];
}

function saveSubscribers(subscribers) {
  localStorage.setItem(STORAGE_KEYS.subscribers, JSON.stringify(subscribers));
}

function ensureDefaultProducts() {
  const current = getProducts();
  const starterProducts = [
    {
      id: "seed-1",
      name: "Noir Essence",
      category: "Evening",
      price: 1499,
      stock: 25,
      notes: "Woody amber with warm spice",
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-2",
      name: "Bloom Aura",
      category: "Floral",
      price: 1299,
      stock: 30,
      notes: "Rose and jasmine with soft musk",
      imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-3",
      name: "Ocean Drift",
      category: "Fresh",
      price: 1199,
      stock: 40,
      notes: "Citrus marine with clean finish",
      imageUrl: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-4",
      name: "Velvet Mist",
      category: "Daily Wear",
      price: 499,
      stock: 45,
      notes: "Soft floral with powdery musk",
      imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-5",
      name: "Citrus Bloom",
      category: "Fresh",
      price: 499,
      stock: 50,
      notes: "Lemon zest and light jasmine",
      imageUrl: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-6",
      name: "Midnight Rose",
      category: "Romantic",
      price: 499,
      stock: 38,
      notes: "Rose petals with warm vanilla",
      imageUrl: "https://images.unsplash.com/photo-1595425964072-6f7af6f4c7aa?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-7",
      name: "Elora Soft Gold",
      category: "Daily Wear",
      price: 499,
      stock: 48,
      notes: "Creamy vanilla and bright citrus for everyday charm",
      imageUrl: "https://images.unsplash.com/photo-1618436917352-efa9f4f4b8cf?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-8",
      name: "Elora Spark Night",
      category: "Evening",
      price: 499,
      stock: 42,
      notes: "Bold spice and soft musk made for date nights",
      imageUrl: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "seed-9",
      name: "Elora Fresh Pulse",
      category: "Fresh",
      price: 499,
      stock: 50,
      notes: "Crisp citrus and aqua notes for all-day freshness",
      imageUrl: "https://images.unsplash.com/photo-1627916561421-8cb5fef9e5df?auto=format&fit=crop&w=900&q=80"
    }
  ];

  if (current.length === 0) {
    saveProducts(starterProducts);
    return;
  }

  const existingIds = new Set(current.map((item) => item.id));
  const missingDefaults = starterProducts.filter((item) => !existingIds.has(item.id));

  if (missingDefaults.length > 0) {
    saveProducts([...current, ...missingDefaults]);
  }
}

function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  const emailInput = document.getElementById("newsletterEmail");
  const message = document.getElementById("newsletterMessage");
  if (!form || !emailInput || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const subscribers = getSubscribers();
    const exists = subscribers.some((item) => item.email === email);

    if (exists) {
      message.classList.remove("hidden");
      message.style.color = "#b45309";
      message.textContent = "You are already subscribed to Elora updates.";
      return;
    }

    subscribers.push({ email, createdAt: new Date().toISOString() });
    saveSubscribers(subscribers);
    form.reset();
    message.classList.remove("hidden");
    message.style.color = "#059669";
    message.textContent = "Thanks for joining Elora Club. Check your inbox for new offers.";
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  initNewsletterForm();
  initScrollReveal();
});
