import { createSlice } from "@reduxjs/toolkit";
const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    // addToCart: (state, action) => {
    //   state.push(action.payload);
    //   localStorage.setItem("cart", JSON.stringify(state));
    // }
    addToCart: (state, action) => {
      const courseAlreadyInCart = state.some(
        (item) => item._id === action.payload._id
      );

      if (!courseAlreadyInCart) {
        state.push(action.payload);

        // 更新 localStorage 中的購物車
        localStorage.setItem("cart", JSON.stringify(state));
      }
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const updatedCart = state.filter((course) => course._id !== courseId);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // 更新後的購物車保存到 localStorage
      return updatedCart;
    },
    clearCart: (state) => {
      localStorage.removeItem("cart"); // 清空購物車時移除 localStorage 中的資料
      return [];
    },
  },
});
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
