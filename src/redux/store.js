import { configureStore } from "@reduxjs/toolkit";
import variableReducer from "./variableSlice";

const store = configureStore({
  reducer: {
    variable: variableReducer,
  },
});

export default store;
