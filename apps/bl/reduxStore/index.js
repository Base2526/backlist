import reducers from '../reducers'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import storage from '@react-native-async-storage/async-storage';

// persist
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  storage,
}

var rds = persistReducer(persistConfig, reducers);
// persist


const middleware = [ thunk ];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger())
}

// const persistedReducer = persistReducer(persistConfig, rootReducer)
// const store = createStore(
//   reducers,
//   applyMiddleware(...middleware)
// );
const logger = createLogger({
  predicate: () => process.env.NODE_ENV !== 'development'
  // predicate: () => process.env.NODE_ENV !== 'production'
});

const store = createStore(rds, applyMiddleware(...middleware));
const persistor = persistStore(store);

export {store, persistor};