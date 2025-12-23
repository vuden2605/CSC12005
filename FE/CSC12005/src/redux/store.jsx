import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import userReducer from "./slices/userSlice";
import notificationReducer from "./slices/notificationSlice";

// persist riêng từng slice
const userPersistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    notifications: notificationReducer, // gộp cùng reducer
  },
});

export const persistor = persistStore(store);
