// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./features/userSlice";
// import cartReducer from "./features/cartSlice";
// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     cart: cartReducer,
//   },
// });

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 默認使用 localStorage 作為存儲引擎
import userReducer from "./features/userSlice";
import cartReducer from "./features/cartSlice";
// 要使用redux-persist必須加這些不然會出錯
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// 配置 persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart"], // 只持久化這些 reducer
};

// 合併 reducers
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

// 創建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 配置 store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
