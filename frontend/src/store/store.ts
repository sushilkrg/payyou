import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";

// ── Custom storage using window.localStorage directly ─────
// Avoids redux-persist/lib/storage module resolution issues in Vite
const storage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// ── Auth persist config ───────────────────────────────────
// Persist isAuthenticated only — blacklist accessToken
// accessToken lives in memory only for security
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["accessToken"], // ← never written to localStorage
};

// ── Root persist config ───────────────────────────────────
// Persist user slice fully, ui slice not at all
const rootPersistConfig = {
  key: "payyou",
  storage,
  whitelist: ["user"], //  only user persisted at root level
  //   auth handled by its own nested config above
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // ← nested persist
  user: userReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
