import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);

  saveToStorage();
}

export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    if (orderId === order.id) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}

export function getProductOrderDetails(productId, order) {
  let matchingProductOrderDetails;

  order.products.forEach((productOrderDetails) => {
    if (productId === productOrderDetails.productId) {
      matchingProductOrderDetails = productOrderDetails;
    }
  });

  return matchingProductOrderDetails;
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function formatOrderDate(date) {
  const dateString = dayjs(date).format('MMM D');
  
  return dateString;
}
