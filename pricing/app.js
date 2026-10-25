'use strict';
const WHATSAPP_NUMBER = '966538834212';
const form = document.querySelector('#quote-form');
const status = document.querySelector('#status');
const yearSelect = document.querySelector('#year');
const currentYear = new Date().getFullYear();
for (let year = currentYear + 1; year >= 1985; year--) {
  yearSelect.add(new Option(String(year), String(year)));
}
document.querySelector('#copyright-year').textContent = currentYear;
const initialMake = new URLSearchParams(location.search).get('make');
if (initialMake === 'hyundai' || initialMake === 'kia') {
  form.elements.make.value = initialMake === 'kia' ? 'كيا' : 'هيونداي';
}
function normalizeDigits(value) {
  return value.replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776));
}
function normalizePhone(value) {
  const phone = normalizeDigits(value).replace(/[\s()+-]/g, '');
  if (/^05\d{8}$/.test(phone)) return '966' + phone.slice(1);
  if (/^9665\d{8}$/.test(phone)) return phone;
  if (/^009665\d{8}$/.test(phone)) return phone.slice(2);
  return null;
}
const phoneInput = document.querySelector('#phone');
const vinInput = document.querySelector('#vin');
for (const input of [phoneInput, vinInput]) {
  input.addEventListener('input', () => input.setCustomValidity(''));
}
form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = '';
  const phone = normalizePhone(phoneInput.value);
  const vin = vinInput.value.trim().toUpperCase();
  phoneInput.setCustomValidity(phone ? '' : 'أدخل رقم جوال سعودي صحيح، مثل 05XXXXXXXX أو +9665XXXXXXXX.');
  vinInput.setCustomValidity(!vin || /^[A-HJ-NPR-Z0-9]{17}$/.test(vin) ? '' : 'رقم الهيكل يتكون من 17 حرفًا ورقمًا بالإنجليزية، ولا يحتوي I أو O أو Q.');
  const model = form.elements.model;
  const parts = form.elements.parts;
  model.setCustomValidity(model.value.trim() ? '' : 'اكتب موديل السيارة.');
  parts.setCustomValidity(parts.value.trim().length >= 3 ? '' : 'اكتب تفاصيل القطع المطلوبة.');
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const message = [
    'طلب تسعير قطع غيار | درة السيارة',
    '',
    ...(name ? ['الاسم: ' + name] : []),
    'الجوال: +' + phone,
    'الشركة: ' + form.elements.make.value,
    'الموديل: ' + model.value.trim(),
    'سنة الصنع: ' + yearSelect.value,
    'رقم الهيكل: ' + (vin || 'غير مرفق'),
    '', 'القطع المطلوبة:', parts.value.trim(),
    '', 'أرجو إفادتي بالسعر والتوفر. أرفق الصور داخل المحادثة إن وجدت.'
  ].join('\n');
  // Navigation only prepares a message. The customer explicitly sends it in WhatsApp.
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  status.textContent = 'جاري فتح واتساب. أرسل الرسالة داخل المحادثة لإتمام الطلب، ثم أرفق الصور إن وجدت.';
  window.location.assign(url);
});
for (const name of ['model', 'parts']) {
  form.elements[name].addEventListener('input', () => form.elements[name].setCustomValidity(''));
}