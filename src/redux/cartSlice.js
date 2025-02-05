import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    carts : {
      cartItems: [],
      showMiniCart: false,
    },
    msg: "",
  },
  reducers: {
    showMiniCart: (state) => {
      state.showMiniCart = true;
    },
    hideMiniCart: (state) => {
      state.showMiniCart = false;
    },
    loginCart: (state, action) => {
      state.carts.cartItems = action.payload;
    },
    addToCart: (state, action) => {
      state.carts.cartItems = action.payload;
    },
    removeFromCart: (state, action) => {
      const idNeedToRemove = action.payload;
      state.carts.cartItems = state.cartItems.filter((x) => x.id !== idNeedToRemove);
    },
    clearCart: (state) => {
      state.carts.cartItems = [];
    },
  }
    
});

const { reducer, actions } = cartSlice;
export const { showMiniCart, hideMiniCart , addToCart, setQuantity, removeFromCart, clearCart, loginCart} =
  cartSlice.actions;

export default cartSlice.reducer;
