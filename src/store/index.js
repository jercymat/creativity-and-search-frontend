import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { globalReducer, ideaReducer, searchReducer } from "../reducers";
import rootSaga from '../sagas';

const saga = createSagaMiddleware();

export default configureStore({
  reducer: {
    global: globalReducer,
    search: searchReducer,
    idea: ideaReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(saga),
});

saga.run(rootSaga);