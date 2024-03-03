// Example: In a utils file for use across your application
const reportKeyPrefix = "report_";
export const saveReport = (reportData) => {
  try {
    const key = reportKeyPrefix + reportData.id;
    const data = JSON.stringify(reportData);
    localStorage.setItem(key, data);
  } catch (error) {
    console.error("Error saving report:", error);
  }
};
