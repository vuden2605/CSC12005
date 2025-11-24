import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // dùng localStorage

import userReducer from "./slices/userSlice";

// persist riêng từng slice
const userPersistConfig = {
  key: "user",
  storage,
};


const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});

export const persistor = persistStore(store);
