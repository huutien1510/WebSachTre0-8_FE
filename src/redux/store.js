import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import attendanceReducer from "./attendanceSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  users: userReducer,
  attendance: attendanceReducer,
  
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

// Add a listener to log state changes

// import {configureStore} from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import userReducer from './userSlice';
// import cartReducer from './cartSlice';

// export const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         users: userReducer,
//         cart : cartReducer
//     },
// });