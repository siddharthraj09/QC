import { useSelector, useDispatch } from "react-redux";
import { selectCommodity } from "../features/reportSlice";

const CropSelection = () => {
  const selectedCommodity = useSelector(
    (state) => state.report.selectedCommodity
  );
  const dispatch = useDispatch();

  const commodities = ["Rice", "Wheat", "Soybeans"]; // Fetch from database ideally

  const handleCommodityChange = (e) => {
    dispatch(selectCommodity(e.target.value));
  };

  return (
    <div className="p-4 rounded-md shadow-md mt-4 w-1/2 mx-auto">
      <h2 className="text-lg font-medium mb-2">Crop Selection</h2>
      <select
        value={selectedCommodity || ""}
        onChange={handleCommodityChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="" disabled>
          Select a crop
        </option>
        {commodities.map((commodity) => (
          <option key={commodity} value={commodity}>
            {commodity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CropSelection;
