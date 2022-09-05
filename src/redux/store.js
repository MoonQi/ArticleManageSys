import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { CollapsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from 'redux-thunk'

const reducers = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistConfig = {
  key: "root",
  storage: storage,
  blacklist: ['LoadingReducer'],
};

const myPersistReducer = persistReducer(persistConfig, reducers);



export const store = configureStore({
  reducer: myPersistReducer,
  middleware: [thunk]
});

export const persistor = persistStore(store);
