export const APP_NAME = "BanglaShop";
export const CURRENCY_SYMBOL = "৳";

export const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', icon: '/icons/bkash.png' },
  { id: 'nagad', name: 'Nagad', icon: '/icons/nagad.png' },
  { id: 'rocket', name: 'Rocket', icon: '/icons/rocket.png' },
  { id: 'card', name: 'Credit/Debit Card (SSLCOMMERZ)', icon: '/icons/card.png' },
  { id: 'cod', name: 'Cash on Delivery', icon: '/icons/cod.png' },
];

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const DELIVERY_TYPES = [
  { id: 'home', name: 'Home Delivery', price: 60, time: '2-3 Days' },
  { id: 'pickup', name: 'Pickup Point', price: 0, time: '1-2 Days' },
];
