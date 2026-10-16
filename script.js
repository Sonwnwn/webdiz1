// 1. Фильтры: показываем только товары выбранной категории.
const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.product-card');
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    const category = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach(function (item) {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    cards.forEach(function (card) {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    document.querySelector('#product-count').textContent = 'Товаров: ' + visibleCount;
  });
});


const productName = document.querySelector('#product-name');
const orderName = document.querySelector('#order-name');
if (productName || orderName) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'relic';
  const product = products.find(function (item) { return item.id === id; }) || products[7];
  const price = product.price.toLocaleString('ru-RU') + ' ₽';
  const image = 'images/' + product.id + '.jpg';
  document.title = product.name + ' — DISTORTION';
  if (productName) {
    productName.textContent = product.name.toUpperCase();
    document.querySelector('#breadcrumb-name').textContent = product.name;
    document.querySelector('#product-kind').textContent = product.kind + ' / DISTORTION';
    document.querySelector('#product-price').textContent = price;
    document.querySelector('#product-detail').textContent = product.detail || 'Размер уточняется при заказе';
    document.querySelector('#product-description').textContent = product.id === 'relic'
      ? 'Пять колец. Два креста. Твой символ.' : 'Твой характер. Твой символ. ' + product.name + '.';
    document.querySelector('#product-image').src = image;
    document.querySelector('#product-image').alt = product.kind + ' ' + product.name;
    document.querySelector('#open-photo').href = image;
    document.querySelector('#open-photo').dataset.title = product.name;
    document.querySelector('#buy-link').href = 'checkout.html?id=' + product.id;
  }
  if (orderName) {
    orderName.textContent = product.name.toUpperCase();
    document.querySelector('#order-price').textContent = price;
    document.querySelector('#order-image').src = image;
    document.querySelector('#order-image').alt = product.kind + ' ' + product.name;
  }
}


const orderForm = document.querySelector('#order-form');
if (orderForm) {
  orderForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const phone = document.querySelector('#phone');
    const digits = phone.value.replace(/\D/g, '');
    const error = document.querySelector('#form-error');
    if (digits.length < 10 || digits.length > 15) {
      error.textContent = 'Проверь номер телефона: нужно от 10 до 15 цифр.';
      phone.focus();
      return;
    }
    error.textContent = '';
    window.location.href = 'success.html';
  });
}


const recommendations = document.querySelector('#recommendations-track');
if (recommendations) {
  const previousButton = document.querySelector('#recommendations-prev');
  const nextButton = document.querySelector('#recommendations-next');
  const currentId = new URLSearchParams(window.location.search).get('id') || 'relic';

  // В рекомендациях оставляем только другие украшения.
  recommendations.querySelectorAll('.product-card').forEach(function (card) {
    const link = card.querySelector('a');
    const id = new URL(link.href).searchParams.get('id');
    if (id === currentId) card.remove();
  });

  function updateSliderButtons() {
    previousButton.disabled = recommendations.scrollLeft <= 1;
    nextButton.disabled = recommendations.scrollLeft + recommendations.clientWidth
      >= recommendations.scrollWidth - 2;
  }

  function scrollProducts(direction) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    recommendations.scrollBy({
      left: direction * recommendations.clientWidth,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  previousButton.addEventListener('click', function () { scrollProducts(-1); });
  nextButton.addEventListener('click', function () { scrollProducts(1); });
  recommendations.addEventListener('scroll', updateSliderButtons);
  window.addEventListener('resize', updateSliderButtons);
  updateSliderButtons();
}
