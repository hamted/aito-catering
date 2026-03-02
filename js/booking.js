// js/booking.js
// Rules:
// 1) Event datetime must be at least 48 hours in the future
// 2) Event time must be between 08:00 and 22:00 (inclusive)
// 3) Minimum guests depends on selected package option's data-min
// 4) Updates estimate + "Minimum guests" text live
// 5) Saves aitoOrder then redirects to info.html

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function toLocalDateInputValue(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateTimeLocal(dateStr, timeStr) {
  // dateStr: YYYY-MM-DD, timeStr: HH:MM
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function isWithinServiceHours(timeStr) {
  // inclusive: 08:00 <= time <= 22:00
  if (!timeStr) return false;
  const [hh, mm] = timeStr.split(":").map(Number);
  const minutes = hh * 60 + mm;
  const open = 8 * 60;   // 08:00
  const close = 22 * 60; // 22:00
  return minutes >= open && minutes <= close;
}

function getMinGuestsFromSelectedOption(packageSelect) {
  const opt = packageSelect?.selectedOptions?.[0];
  const min = Number(opt?.dataset?.min);
  return Number.isFinite(min) && min > 0 ? min : 1;
}

function updateEstimate() {
  const packageSelect = document.getElementById("package");
  const guestsInput = document.getElementById("guests");
  const estimateEl = document.getElementById("estimateText");
  const minTextEl = document.getElementById("minGuestsText");

  if (!packageSelect || !guestsInput || !estimateEl) return;

  const pricePerPerson = Number(packageSelect.value);
  const minGuests = getMinGuestsFromSelectedOption(packageSelect);

  let guests = Number(guestsInput.value);
  if (!Number.isFinite(guests) || guests < minGuests) {
    guests = minGuests;
    guestsInput.value = String(minGuests);
  }

  guestsInput.min = String(minGuests);

  const total = (Number.isFinite(pricePerPerson) ? pricePerPerson : 0) * guests;
  estimateEl.textContent = `${formatMoney(total)} (${formatMoney(pricePerPerson)} x ${guests})`;

  if (minTextEl) {
    minTextEl.textContent = `Minimum guests: ${minGuests}`;
  }
}

function enforceDateMin48h() {
  const dateEl = document.getElementById("eventDate");
  if (!dateEl) return;

  const now = new Date();
  const minDateTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Date input can only set a DATE min, so we set min date to the minDateTime's date.
  dateEl.min = toLocalDateInputValue(minDateTime);
}

function enforceTimeWindow() {
  const timeEl = document.getElementById("eventTime");
  if (!timeEl) return;

  timeEl.min = "08:00";
  timeEl.max = "22:00";
}

function validate48hAndHours(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    return { ok: false, message: "Please choose a date and time." };
  }

  // Check service hours
  if (!isWithinServiceHours(timeStr)) {
    return { ok: false, message: "Please choose a time between 08:00 and 22:00." };
  }

  const selected = parseDateTimeLocal(dateStr, timeStr);
  const minDateTime = new Date(Date.now() + 48 * 60 * 60 * 1000);

  if (selected.getTime() < minDateTime.getTime()) {
    return { ok: false, message: "Please choose a date/time at least 48 hours from now." };
  }

  return { ok: true, message: "" };
}

document.addEventListener("DOMContentLoaded", () => {
  const packageEl = document.getElementById("package");
  const guestsEl = document.getElementById("guests");
  const form = document.getElementById("orderForm");
  const dateEl = document.getElementById("eventDate");
  const timeEl = document.getElementById("eventTime");

  if (!packageEl || !guestsEl || !form) return;

  // Enforce constraints on load
  enforceDateMin48h();
  enforceTimeWindow();

  // Estimate changes
  packageEl.addEventListener("change", updateEstimate);
  guestsEl.addEventListener("input", updateEstimate);

  // If user changes date/time, we can gently auto-correct time if it goes out of range
  if (timeEl) {
    timeEl.addEventListener("change", () => {
      if (!isWithinServiceHours(timeEl.value)) {
        timeEl.value = "08:00";
      }
    });
  }

  if (dateEl) {
    dateEl.addEventListener("change", () => {
      // If date is < min date, reset it
      const minDate = dateEl.min;
      if (minDate && dateEl.value && dateEl.value < minDate) {
        dateEl.value = minDate;
      }
    });
  }

  updateEstimate();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const minGuests = getMinGuestsFromSelectedOption(packageEl);
    const guests = Number(guestsEl.value);

    if (!Number.isFinite(guests) || guests < minGuests) {
      alert(`Minimum guests for this package is ${minGuests}.`);
      guestsEl.value = String(minGuests);
      updateEstimate();
      return;
    }

    const dateStr = document.getElementById("eventDate")?.value || "";
    const timeStr = document.getElementById("eventTime")?.value || "";

    const dtCheck = validate48hAndHours(dateStr, timeStr);
    if (!dtCheck.ok) {
      alert(dtCheck.message);
      return;
    }

    const pricePerPerson = Number(packageEl.value);
    const total = pricePerPerson * guests;

    const orderData = {
      packageName: packageEl.options[packageEl.selectedIndex].text,
      pricePerPerson,
      minGuests,
      eventType: document.getElementById("eventType")?.value.trim() || "",
      eventDate: dateStr,
      eventTime: timeStr,
      guests,
      venue: document.getElementById("venue")?.value.trim() || "",
      requests: document.getElementById("requests")?.value.trim() || "",
      total
    };

    localStorage.setItem("aitoOrder", JSON.stringify(orderData));

    // Next step: customer info page
    window.location.href = "info.html";
  });
});