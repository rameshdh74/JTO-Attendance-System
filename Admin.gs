// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all attendance records
function getAllAttendanceRecords() {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(ATTENDANCE_SHEET);
    const data = sheet.getDataRange().getValues();
    
    const records = [];
    
    for (let i = 1; i < data.length; i++) {
      records.push({
        date: data[i][0],
        jtoId: data[i][1],
        email: data[i][2],
        name: data[i][3],
        trade: data[i][4],
        unit: data[i][5],
        subject: data[i][6],
        sanctioned: data[i][7],
        onroll: data[i][8],
        presentCount: data[i][9],
        absent: data[i][10],
        submittedAt: data[i][11]
      });
    }
    
    return records;
  } catch (error) {
    Logger.log('Error getting records: ' + error);
    return [];
  }
}

// ============================================
// ADMIN - SERVE ADMIN DASHBOARD
// ============================================
function doGetAdmin(e) {
  // Add authentication check here if needed
  const html = HtmlService.createHtmlFromFile('admin');
  return html.evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
