/* ========================================================
   SREEKANTH LAUNDRY SHOP - SCRIPT.JS
   ======================================================== */

// Set min date to today for pickup booking
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
  updateCalc();
});

// Toggle Mobile Nav Menu
function toggleMenu() {
  const nav = document.getElementById('navMenu');
  nav.classList.toggle('active');
}

// Navbar scroll shadow
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Interactive Calculator
function updateSlider(val) {
  const serviceSelect = document.getElementById('calcService');
  const selectedOpt = serviceSelect.options[serviceSelect.selectedIndex];
  const unit = selectedOpt.getAttribute('data-unit') || 'kg';
  document.getElementById('sliderVal').textContent = `${val} ${unit}`;
  updateCalc();
}

function updateCalc() {
  const serviceSelect = document.getElementById('calcService');
  const slider = document.getElementById('calcSlider');
  const expressCheck = document.getElementById('calcExpress');
  
  if (!serviceSelect || !slider) return;

  const rate = parseFloat(serviceSelect.value) || 0;
  const qty = parseInt(slider.value) || 1;
  const isExpress = expressCheck && expressCheck.checked ? 30 : 0;
  
  const selectedOpt = serviceSelect.options[serviceSelect.selectedIndex];
  const unit = selectedOpt.getAttribute('data-unit') || 'kg';
  const name = selectedOpt.getAttribute('data-name') || '';

  // Update slider label
  const sliderLabel = document.getElementById('sliderLabel');
  if (sliderLabel) {
    sliderLabel.textContent = unit === 'kg' ? 'Weight (kg):' : 'Quantity (pieces):';
  }

  const subtotal = rate * qty;
  const total = subtotal + isExpress;

  const totalDisplay = document.getElementById('calcTotal');
  if (totalDisplay) totalDisplay.textContent = total;

  const detailDisplay = document.getElementById('calcDetail');
  if (detailDisplay) {
    detailDisplay.textContent = `${qty} ${unit} × ₹${rate} (${name})${isExpress ? ' + ₹30 Express' : ''}`;
  }

  const freeDeliveryPill = document.getElementById('freeDeliveryPill');
  if (freeDeliveryPill) {
    if (total >= 300) {
      freeDeliveryPill.textContent = '🎉 FREE Doorstep Delivery included (Order > ₹300)!';
      freeDeliveryPill.style.display = 'block';
    } else {
      freeDeliveryPill.textContent = `💡 Add ₹${300 - total} more for FREE Doorstep Delivery!`;
      freeDeliveryPill.style.display = 'block';
    }
  }
}

// Push Calculator selection into booking form
function applyCalcToBooking() {
  const serviceSelect = document.getElementById('calcService');
  const selectedOpt = serviceSelect.options[serviceSelect.selectedIndex];
  const name = selectedOpt.getAttribute('data-name');
  const slider = document.getElementById('calcSlider');
  const unit = selectedOpt.getAttribute('data-unit');

  selectServiceInForm(name);

  const loadWeightInput = document.getElementById('loadWeight');
  if (loadWeightInput && slider) {
    loadWeightInput.value = `${slider.value} ${unit}`;
  }

  showToast(`Applied ${name} estimate to booking!`);
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Helper to select service in form
function selectServiceInForm(serviceName) {
  const formService = document.getElementById('service');
  if (formService) {
    for (let i = 0; i < formService.options.length; i++) {
      if (formService.options[i].value === serviceName) {
        formService.selectedIndex = i;
        break;
      }
    }
  }
}

// Copy promo code
function copyPromoCode() {
  navigator.clipboard.writeText('FRESH15').then(() => {
    showToast('Promo code FRESH15 copied to clipboard!');
  }).catch(() => {
    showToast('Promo code: FRESH15');
  });
}

// FAQ Accordion
function toggleFaq(item) {
  item.classList.toggle('active');
}

// Handle Form Submit
let lastBookingData = {};

function handleBooking(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const timeSlot = document.getElementById('timeSlot').value;
  const loadWeight = document.getElementById('loadWeight').value.trim() || 'Not specified';
  const address = document.getElementById('address').value.trim();

  const bookingId = 'SL-' + Math.floor(1000 + Math.random() * 9000);

  lastBookingData = { bookingId, name, phone, service, date, timeSlot, loadWeight, address };

  const modalReceipt = document.getElementById('modalReceipt');
  if (modalReceipt) {
    modalReceipt.innerHTML = `
      <strong>Booking ID:</strong> ${bookingId}<br>
      <strong>Customer:</strong> ${name} (${phone})<br>
      <strong>Service:</strong> ${service}<br>
      <strong>Pickup Slot:</strong> ${date} | ${timeSlot}<br>
      <strong>Estimated Items:</strong> ${loadWeight}<br>
      <strong>Address:</strong> ${address}
    `;
  }

  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('active');
  const form = document.getElementById('bookingForm');
  if (form) form.reset();
  showToast('Booking logged! We look forward to serving you.');
}

// WhatsApp Booking
function sendViaWhatsApp() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const timeSlot = document.getElementById('timeSlot').value;
  const loadWeight = document.getElementById('loadWeight').value.trim() || 'Standard load';
  const address = document.getElementById('address').value.trim();

  if (!name || !phone || !address) {
    showToast('Please fill in Name, Phone, and Address first!');
    return;
  }

  const msg = `*New Laundry Pickup Booking - Sreekanth Laundry*%0A%0A` +
              `*Customer:* ${encodeURIComponent(name)}%0A` +
              `*Phone:* ${encodeURIComponent(phone)}%0A` +
              `*Service:* ${encodeURIComponent(service)}%0A` +
              `*Date:* ${encodeURIComponent(date)}%0A` +
              `*Time Slot:* ${encodeURIComponent(timeSlot)}%0A` +
              `*Estimated Load:* ${encodeURIComponent(loadWeight)}%0A` +
              `*Pickup Address:* ${encodeURIComponent(address)}%0A%0A` +
              `Please confirm my pickup. Thank you!`;

  window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
}

function shareBookingToWhatsApp() {
  if (!lastBookingData.name) return;
  const d = lastBookingData;
  const msg = `*Booking Confirmed - ${d.bookingId}*%0A%0A` +
              `*Customer:* ${encodeURIComponent(d.name)}%0A` +
              `*Service:* ${encodeURIComponent(d.service)}%0A` +
              `*Pickup:* ${encodeURIComponent(d.date)} (${encodeURIComponent(d.timeSlot)})%0A` +
              `*Address:* ${encodeURIComponent(d.address)}`;
  window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
  closeModal();
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}
