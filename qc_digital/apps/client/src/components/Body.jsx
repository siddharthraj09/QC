import CropSelection from "./CropSelection";
import ImageCapture from "./ImageCapture";
import { useSelector } from "react-redux";
import Report from "./Report";
const Body = () => {
  const cropSelection = useSelector((store) => store.report?.selectedCommodity);

  return (
    <div className="w-screen">
      <div>
        <CropSelection />

        {cropSelection && <ImageCapture />}
        <Report />
      </div>
    </div>
  );
};

export default Body;
