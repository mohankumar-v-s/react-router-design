import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import type { Persistor } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import authReducer from './slices/authSlice';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const createNoopStorage = (): StorageLike => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage: ReturnType<typeof createWebStorage> | StorageLike =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Add reducer names you want to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor: Persistor | null = typeof window !== 'undefined' ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;