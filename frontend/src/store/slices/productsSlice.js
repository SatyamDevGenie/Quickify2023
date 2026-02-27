import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products');
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Product not found'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', {});
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Create failed'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${product._id}`, product);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Update failed'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Delete failed'
      );
    }
  }
);

export const createReview = createAsyncThunk(
  'products/createReview',
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      await api.post(`/products/${productId}/reviews`, review);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Review failed'
      );
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    selectedProduct: null,
    loading: false,
    error: null,
    productLoading: false,
    productError: null,
    createSuccess: false,
    createLoading: false,
    createError: null,
    updateSuccess: false,
    updateLoading: false,
    updateError: null,
    deleteSuccess: false,
    deleteLoading: false,
    deleteError: null,
    reviewSuccess: false,
    reviewLoading: false,
    reviewError: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
      state.createError = null;
      state.lastCreatedProduct = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
      state.updateError = null;
    },
    clearReviewSuccess: (state) => {
      state.reviewSuccess = false;
      state.reviewError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload;
        state.productError = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.lastCreatedProduct = action.payload;
        state.list.push(action.payload);
        state.createError = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.selectedProduct = action.payload;
        state.list = state.list.map((p) => (p._id === action.payload._id ? action.payload : p));
        state.updateError = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.list = state.list.filter((p) => p._id !== action.payload);
        state.selectedProduct = null;
        state.deleteError = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      // createReview
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
        state.reviewError = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      });
  },
});

export const {
  clearSelectedProduct,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearReviewSuccess,
} = productsSlice.actions;
export default productsSlice.reducer;
