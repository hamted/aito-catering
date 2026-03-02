// js/info.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("customerForm");
  if (!form) return;

  // Optional: prefill if user comes back
  const saved = localStorage.getItem("aitoCustomer");
  if (saved) {
    const data = JSON.parse(saved);
    const setVal = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };

    setVal("firstName", data.firstName);
    setVal("lastName", data.lastName);
    setVal("phone", data.phone);
    setVal("email", data.email);
    setVal("address1", data.address1);
    setVal("city", data.city);
    setVal("province", data.province);
    setVal("postal", data.postal);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const customer = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      address1: document.getElementById("address1").value.trim(),
      city: document.getElementById("city").value.trim(),
      province: document.getElementById("province").value.trim(),
      postal: document.getElementById("postal").value.trim()
    };

    localStorage.setItem("aitoCustomer", JSON.stringify(customer));

    // Go to confirmation page
    window.location.href = "confirmation.html";
  });
});