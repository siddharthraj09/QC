import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useDispatch } from "react-redux";
import { uploadImage, resetImage } from "../features/reportSlice";
import { useSelector } from "react-redux";
import config from "../../config";

const ImageCapture = () => {
  const { report, isLoading, error } = useSelector((state) => state.report);
  const [capturedImage, setCapturedImage] = useState(null);
  const dispatch = useDispatch();
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSubmit = async () => {
    try {
      dispatch(uploadImage(capturedImage));
      setCapturedImage(null);
      dispatch(resetImage());
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  //   Fetch PDF after a successful submission

  return (
    <div className="p-4 rounded-md shadow-md text-center flex flex-col justify-center items-center">
      <h2 className="text-lg font-medium mb-2">Image Capture</h2>
      <Webcam
        ref={webcamRef}
        height={600}
        width={600}
        screenshotFormat="image/jpeg"
        className="w-full h-96" // Adjust dimensions as needed
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white mt-2"
        onClick={captureImage}
      >
        Capture Image
      </button>
      {capturedImage && (
        <div className="mt-2 ">
          <img src={capturedImage} alt="Captured" className="w-64 " />

          <button
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white mt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
      {isLoading && <p className="text-center mt-2">Uploading image...</p>}

      {error && (
        <p className="text-red-600 text-center mt-2">Error: {error.message}</p>
      )}
      {report && (
        <div className="mt-4">
          <h2>Recent Report</h2>
          <ul className="">
            <li>
              <a
                href={config?.baseUrl + report?.pdfData?.imagePath}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="w-24 p-2"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                  alt=""
                />
                <p>{report?.pdfData?.id}</p>
                <span className="font-bold">View PDF</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
