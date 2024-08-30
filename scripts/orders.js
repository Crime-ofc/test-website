import { orders, getOrder, formatOrderDate } from "../data/orders.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";
import formatCurrency from "./utils/money.js"
import { getProduct, loadProductsFetch, products } from "../data/products.js";

console.log(orders);

let timeoutId;

loadOrderPage();

async function loadOrderPage() {
  try {
    await loadProductsFetch();

  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrdersHeader();
  renderOrdersPlaced();


  function renderOrdersPlaced() {
    let ordersHTML = '';

    
    orders.forEach((order) => {

      const dateString = formatOrderDate(order.orderTime);
      
      ordersHTML += `
      <div class="order-container">      
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dateString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
    
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
    
        <div class="order-details-grid">
          ${renderOrderDetails(order)}
        </div>
      </div>
      `
    });

    document.querySelector('.js-orders-grid')
      .innerHTML = ordersHTML;

    document.querySelectorAll('.js-buy-again-button')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const productId = button.dataset.productId;
          addToCart(productId);

          renderOrdersHeader();
          
          button.innerHTML = 'Added';

          if (timeoutId) {
            clearTimeout(timeoutId);  
          }

          timeoutId = setTimeout(() => {
            button.innerHTML = `
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            `
            
          }, 1000);

          
        });
      });
  }

  function renderOrderDetails(order) {
    let orderDetailsHTML = '';
    
    order.products.forEach((productDetails)=> {
      
      const product = getProduct(productDetails.productId); 
      const dateString = formatOrderDate(productDetails.estimatedDeliveryTime);
      //console.log(product);
      //console.log(productDetails);
      console.log(order);


      orderDetailsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${dateString}
        </div>
        <div class="product-quantity">
          Quantity: ${productDetails.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again-button"
        data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
      `
    });

    return orderDetailsHTML;
  }

  function renderOrdersHeader() {
    const cartQuantity = calculateCartQuantity();

    const orderHeaderHTML = `
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
        .innerHTML = orderHeaderHTML;
  }
}
