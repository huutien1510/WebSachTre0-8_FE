import { createSelector } from 'reselect';

const selectCartItems = (state) => state.cart.carts.cartItems;

export const selectProducts = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.map(product => ({
    ...product,
    selected: true,
    quantity: 1
  }))
);