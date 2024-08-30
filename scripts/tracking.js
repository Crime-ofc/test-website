import { getProduct, loadProductsFetch } from "../data/products.js";
import { getOrder, getProductOrderDetails } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { calculateCartQuantity } from "../data/cart.js";

loadPage();

async function loadPage() {
  try {
    await loadProductsFetch();

  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderTrackingHeader();
  renderProductSummary();
}

function renderProductSummary() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const product = getProduct(productId);
  const order = getOrder(orderId); 

  const productOrderDetails = getProductOrderDetails(productId, order);
  //console.log(order);
  //console.log(productOrderDetails);

  const deliveryProgress = calculateDeliveryProgress(order.orderTime, productOrderDetails.estimatedDeliveryTime);

  const orderTrackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${dayjs(productOrderDetails.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productOrderDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${deliveryProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(deliveryProgress < 100 && deliveryProgress >= 50) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${deliveryProgress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width:${deliveryProgress}%"></div>
    </div>  
  `;

  document.querySelector('.js-order-tracking')
    .innerHTML = orderTrackingHTML;
}

function renderTrackingHeader() {
  const cartQuantity = calculateCartQuantity();

  const trackingHeaderHTML = `
  <div class="amazon-header-left-section">
    <a href="amazon.html" class="header-link">
      <img class="amazon-logo"
        src="images/amazon-logo-white.png">
      <img class="amazon-mobile-logo"
        src="images/amazon-mobile-logo-white.png">
    </a>
  </div>

  <div class="amazon-header-middle-section">
    <input class="search-bar" type="text" placeholder="Search">

    <button class="search-button">
      <img class="search-icon" src="images/icons/search-icon.png">
    </button>
  </div>

  <div class="amazon-header-right-section">
    <a class="orders-link header-link" href="orders.html">
      <span class="returns-text">Returns</span>
      <span class="orders-text">& Orders</span>
    </a>

    <a class="cart-link header-link" href="checkout.html">
      <img class="cart-icon" src="images/icons/cart-icon.png">
      <div class="cart-quantity">${cartQuantity}</div>
      <div class="cart-text">Cart</div>
    </a>
  </div>
  `;

  document.querySelector('.js-amazon-header')
    .innerHTML = trackingHeaderHTML;
}


function calculateDeliveryProgress(orderTime, deliveryTime) {
  const currentTime = dayjs();

  orderTime = dayjs(orderTime);
  deliveryTime = dayjs(deliveryTime);

  const deliveryProgress = (currentTime.diff(orderTime) / deliveryTime.diff(orderTime)) * 100;

  if (deliveryProgress < 0) {
    deliveryProgress === 0;
  } else if (deliveryProgress > 100) {
    deliveryProgress === 100;
  }
  return deliveryProgress;
}
