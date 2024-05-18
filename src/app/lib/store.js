import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // 使用本地存儲（local storage）
// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, userReducer);
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
// export const persistor = persistStore(store);
export default store;
