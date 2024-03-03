import { useEffect, useState } from "react";
import config from "../../config";
import { saveReport } from "../utils/localStorage";

const Report = () => {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${config?.apiBaseUrl}/reports`);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
        saveReport(reports);
        // console.log(reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);
  return (
    <>
      {reports && (
        <div className="mt-4 w-full text-center ">
          <h2>All Reports</h2>
          <ul className="flex flex-wrap justify-center">
            {reports.map((data) => {
              return (
                <li key={data?.id} className=" p-4">
                  <a
                    href={config?.baseUrl + data?.imagePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="w-24"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                      alt=""
                    />
                    <p>{data?.id}</p>
                    <span className="font-bold">View PDF</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Report;
