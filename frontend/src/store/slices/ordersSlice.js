import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Order failed'
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Order not found'
      );
    }
  }
);

export const payOrder = createAsyncThunk(
  'orders/payOrder',
  async ({ orderId, paymentResult }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Payment failed'
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/myorders');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch orders'
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch orders'
      );
    }
  }
);

export const deliverOrder = createAsyncThunk(
  'orders/deliverOrder',
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${order._id}/deliver`, order);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Delivery update failed'
      );
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    createdOrder: null,
    createLoading: false,
    createError: null,
    orderDetails: null,
    orderLoading: false,
    orderError: null,
    payLoading: false,
    payError: null,
    myOrders: [],
    myOrdersLoading: false,
    myOrdersError: null,
    allOrders: [],
    allOrdersLoading: false,
    allOrdersError: null,
    deliverLoading: false,
    deliverError: null,
    deliverSuccess: false,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.orderError = null;
    },
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
      state.createError = null;
    },
    clearPaySuccess: (state) => {
      state.payError = null;
    },
    clearDeliverSuccess: (state) => {
      state.deliverSuccess = false;
      state.deliverError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createdOrder = action.payload;
        state.createError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderDetails = action.payload;
        state.orderError = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
      })
      // payOrder
      .addCase(payOrder.pending, (state) => {
        state.payLoading = true;
        state.payError = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.payLoading = false;
        state.orderDetails = action.payload;
        state.payError = null;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.payLoading = false;
        state.payError = action.payload;
      })
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload;
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrdersError = action.payload;
      })
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.allOrdersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload;
        state.allOrdersError = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError = action.payload;
      })
      // deliverOrder
      .addCase(deliverOrder.pending, (state) => {
        state.deliverLoading = true;
        state.deliverError = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.deliverLoading = false;
        state.deliverSuccess = true;
        state.orderDetails = action.payload;
        state.allOrders = state.allOrders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
        state.deliverError = null;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.deliverLoading = false;
        state.deliverError = action.payload;
      });
  },
});

export const {
  clearOrderDetails,
  clearCreatedOrder,
  clearPaySuccess,
  clearDeliverSuccess,
} = ordersSlice.actions;
export default ordersSlice.reducer;
