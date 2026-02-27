import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ id, qty }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty: Number(qty),
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const loadCartFromStorage = () => {
  try {
    const cartItems = localStorage.getItem('cartItems');
    const shippingAddress = localStorage.getItem('shippingAddress');
    const paymentMethod = localStorage.getItem('paymentMethod');
    return {
      cartItems: cartItems ? JSON.parse(cartItems) : [],
      shippingAddress: shippingAddress ? JSON.parse(shippingAddress) : {},
      paymentMethod: paymentMethod ? JSON.parse(paymentMethod) : 'paypal',
    };
  } catch {
    return { cartItems: [], shippingAddress: {}, paymentMethod: 'paypal' };
  }
};

const { cartItems: savedCartItems, shippingAddress: savedAddress, paymentMethod: savedPayment } = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: savedCartItems,
    shippingAddress: savedAddress,
    paymentMethod: savedPayment,
  },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const exists = state.cartItems.find((i) => i.product === item.product);
      if (exists) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === item.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.fulfilled, (state, action) => {
      const item = action.payload;
      const exists = state.cartItems.find((i) => i.product === item.product);
      if (exists) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === item.product ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    });
  },
});

export const { addItem, removeItem, saveShippingAddress, savePaymentMethod } = cartSlice.actions;
export default cartSlice.reducer;
