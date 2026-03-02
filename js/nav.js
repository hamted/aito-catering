// js/nav.js
document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  if (!cartBtn) return;

  cartBtn.addEventListener("click", () => {
    const order = localStorage.getItem("aitoOrder");
    const customer = localStorage.getItem("aitoCustomer");

    if (!order) {
      window.location.href = "menu.html";
      return;
    }

    if (order && !customer) {
      window.location.href = "info.html";
      return;
    }

    window.location.href = "confirmation.html";
  });
});