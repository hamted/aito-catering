// js/booking.js

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function updateEstimate() {
  const packageSelect = document.getElementById("package");
  const guestsInput = document.getElementById("guests");
  const estimateEl = document.getElementById("estimateText");
  const minTextEl = document.getElementById("minGuestsText");

  if (!packageSelect || !guestsInput || !estimateEl) return;

  const pricePerPerson = Number(packageSelect.value);

  // Read min guests from the selected <option data-min="...">
  const minGuests = Number(packageSelect.selectedOptions[0].dataset.min);

  // Enforce strict minimum (and sanitize invalid input)
  let guests = Number(guestsInput.value);
  if (!Number.isFinite(guests) || guests < minGuests) {
    guests = minGuests;
    guestsInput.value = String(minGuests);
  }

  // Update the HTML min attribute so arrows + typing are constrained
  guestsInput.min = String(minGuests);

  // Update estimate
  const total = pricePerPerson * guests;
  estimateEl.textContent = `${formatMoney(total)} (${formatMoney(pricePerPerson)} x ${guests})`;

  // Show minimum guests helper text (if the element exists)
  if (minTextEl) {
    minTextEl.textContent = `Minimum guests: ${minGuests}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const packageEl = document.getElementById("package");
  const guestsEl = document.getElementById("guests");
  const form = document.getElementById("orderForm");

  if (!packageEl || !guestsEl || !form) return;

  // Recalculate when package changes or guest count changes
  packageEl.addEventListener("change", updateEstimate);
  guestsEl.addEventListener("input", updateEstimate);

  // Initial calculation
  updateEstimate();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const minGuests = Number(packageEl.selectedOptions[0].dataset.min);
    const guests = Number(guestsEl.value);

    // Final strict validation on submit
    if (!Number.isFinite(guests) || guests < minGuests) {
      alert(`Minimum guests for this package is ${minGuests}.`);
      guestsEl.value = String(minGuests);
      updateEstimate();
      return;
    }

    const pricePerPerson = Number(packageEl.value);
    const total = pricePerPerson * guests;

    const orderData = {
      packageName: packageEl.options[packageEl.selectedIndex].text,
      pricePerPerson,
      minGuests,
      eventType: document.getElementById("eventType")?.value.trim() || "",
      eventDate: document.getElementById("eventDate")?.value || "",
      eventTime: document.getElementById("eventTime")?.value || "",
      guests,
      venue: document.getElementById("venue")?.value.trim() || "",
      requests: document.getElementById("requests")?.value.trim() || "",
      total
    };

    // Save for confirmation page
    localStorage.setItem("aitoOrder", JSON.stringify(orderData));

    // Go to confirmation page
    window.location.href = "info.html";
  });
});