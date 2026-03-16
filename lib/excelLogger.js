import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "lead-report.xlsx");

let excelQueue = Promise.resolve();

export function logLeadToExcel(data) {
  excelQueue = excelQueue.then(async () => {
    const workbook = new ExcelJS.Workbook();
    let sheet;

    if (fs.existsSync(filePath)) {
      await workbook.xlsx.readFile(filePath);
      sheet = workbook.getWorksheet("Leads");
    } else {
      sheet = workbook.addWorksheet("Leads");

      sheet.columns = [
        { header: "Name", key: "name", width: 20 },
        { header: "Mobile", key: "mobile", width: 15 },
        { header: "Model", key: "model", width: 20 },
        { header: "City", key: "city", width: 20 },
        { header: "Status", key: "status", width: 15 },
        { header: "Error", key: "error", width: 25 },
        { header: "Time", key: "time", width: 25 },
      ];
    }

    sheet.addRow(data);

    await workbook.xlsx.writeFile(filePath);
  });

  return excelQueue;
}