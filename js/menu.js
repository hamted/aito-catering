// js/menu.js
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".aito-select-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const packageName = btn.dataset.name;
      const pricePerPerson = Number(btn.dataset.price);
      const minGuests = Number(btn.dataset.min);

      const orderData = {
        packageName,
        pricePerPerson,
        minGuests,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("aitoOrder", JSON.stringify(orderData));

      // Go to booking page
      window.location.href = "booking.html";
    });
  });
});