import { configureStore } from "@reduxjs/toolkit";

import reportReducer from "./features/reportSlice";

export const store = configureStore({
  reducer: {
    report: reportReducer,
  },
});

export default store;
