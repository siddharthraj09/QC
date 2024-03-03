import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config";

const initialState = {
  selectedCommodity: null,
  isLoading: false,
  report: null,
  error: null, // Add error state
  // ...other state variables
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setIsLoading(state) {
      state.isLoading = !state.isLoading;
    },
    selectCommodity(state, action) {
      state.selectedCommodity = action.payload;
    },
    resetImage(state) {
      // Add a reset reducer
      state.report = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.report = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const uploadImage = createAsyncThunk(
  "/uploadImage",
  async (image, { getState }) => {
    try {
      const formData = new FormData();

      formData.append("image", image); // Assuming image is a base64 data URL
      const selectedCommodity = getState().report.selectedCommodity;
      formData.append("commodity", selectedCommodity);
      // console.log(formData);

      const response = await fetch(`${config?.apiBaseUrl}/image-upload`, {
        mode: "cors",
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const reportData = await response.json();
      return reportData;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw the error to be handled by Redux Toolkit
    }
  }
);

export const { selectCommodity, resetImage } = reportSlice.actions; // Add resetImage
export default reportSlice.reducer;
