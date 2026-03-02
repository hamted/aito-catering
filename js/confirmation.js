document.addEventListener("DOMContentLoaded", () => {

  const order = JSON.parse(localStorage.getItem("aitoOrder"));
  const customer = JSON.parse(localStorage.getItem("aitoCustomer"));

  // Generate order number (persist across refresh)
  let orderNum = localStorage.getItem("aitoOrderNumber");
  if (!orderNum) {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    orderNum = "#ON" + random;
    localStorage.setItem("aitoOrderNumber", orderNum);
  }

  document.getElementById("orderNumber").textContent = orderNum;
  document.getElementById("confirmEmail").textContent =
    customer?.email || "your@email.com";

  // Delivery details
  document.getElementById("deliveryDetails").innerHTML = `
    ${customer?.firstName || ""} ${customer?.lastName || ""}<br>
    ${customer?.address1 || ""},<br>
    ${customer?.city || ""}, ${customer?.province || ""}.<br>
    ${customer?.postal || ""}<br>
    ${customer?.phone || ""}
  `;

  // Rating logic
  const buttons = document.querySelectorAll(".rating-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem("aitoRating", btn.dataset.rate);
    });
  });

});