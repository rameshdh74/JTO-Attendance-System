// ============================================
// ADMIN FUNCTIONS
// ============================================

// Get all attendance records
function getAllAttendanceRecords() {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(ATTENDANCE_SHEET);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    const records = [];
    
    for (let i = 1; i < data.length; i++) {
      // Skip empty rows
      if (!data[i][1]) continue; // Skip if no JTO ID
      
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
  const html = HtmlService.createHtmlFromFile('admin');
  return html.evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ============================================
// GENERATE ACCESS LINKS FOR ALL JTOs
// ============================================
function generateAccessLinks() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const data = sheet.getDataRange().getValues();
  
  // Get deployment ID from URL
  const DEPLOYMENT_ID = ScriptApp.getService().getUrl().match(/\/d\/([^\/]+)\//)[1];
  
  const links = {};
  
  for (let i = 1; i < data.length; i++) {
    const jtoId = data[i][0] ? data[i][0].toString().trim() : '';
    const email = data[i][1] ? data[i][1].toString().trim() : '';
    const name = data[i][2] ? data[i][2].toString().trim() : '';
    
    // Skip empty rows or rows without email
    if (!jtoId || !email) continue;
    
    // Only generate one link per JTO (not per row)
    if (!links[jtoId]) {
      const link = `https://script.google.com/macros/d/${DEPLOYMENT_ID}/userweb?jtoId=${encodeURIComponent(jtoId)}&email=${encodeURIComponent(email)}`;
      
      links[jtoId] = {
        jtoId: jtoId,
        name: name,
        email: email,
        link: link
      };
    }
  }
  
  return Object.values(links);
}

// ============================================
// SEND LINKS VIA EMAIL
// ============================================
function sendAccessLinksViaEmail() {
  const links = generateAccessLinks();
  let successCount = 0;
  let failureCount = 0;
  
  links.forEach(item => {
    try {
      if (!item.email) {
        failureCount++;
        return;
      }
      
      const subject = `JTO Attendance System - Your Access Link`;
      const message = `
Hello ${item.name},

Your unique attendance tracking link:

${item.link}

IMPORTANT INSTRUCTIONS:
1. Click the link above (keep it safe)
2. Select the date for attendance
3. Select the unit you are teaching
4. If you teach multiple subjects, select the subject
5. Enter the number of students present
6. Click "Submit Attendance"

FEATURES:
✓ Each subject can be submitted once per day
✓ You can submit attendance for multiple subjects/units
✓ Absent count is auto-calculated
✓ Your data is secure and private

TROUBLESHOOTING:
- If link doesn't work, check your email address matches exactly
- Contact admin if you face any issues

Best regards,
Attendance Management System
      `;
      
      GmailApp.sendEmail(item.email, subject, message);
      Logger.log(`Email sent successfully to ${item.email}`);
      successCount++;
      
    } catch (error) {
      Logger.log(`Failed to send email to ${item.email}: ${error}`);
      failureCount++;
    }
  });
  
  return {
    totalLinks: links.length,
    emailsSent: successCount,
    emailsFailed: failureCount,
    message: `Sent ${successCount} emails, ${failureCount} failed`
  };
}

// ============================================
// CREATE LINKS SHEET
// ============================================
function createLinksSheet() {
  const links = generateAccessLinks();
  const spreadsheet = SpreadsheetApp.getActive();
  
  // Check if sheet exists and delete it
  let linksSheet = spreadsheet.getSheetByName("GeneratedLinks");
  if (linksSheet) {
    spreadsheet.deleteSheet(linksSheet);
  }
  
  // Create new sheet
  linksSheet = spreadsheet.insertSheet("GeneratedLinks");
  
  // Add headers
  linksSheet.appendRow(["JTO ID", "Name", "Email", "Access Link"]);
  
  // Add data
  links.forEach(item => {
    linksSheet.appendRow([
      item.jtoId,
      item.name,
      item.email,
      item.link
    ]);
  });
  
  // Auto-resize columns
  linksSheet.autoResizeColumns(1, 4);
  
  Logger.log(`Created ${links.length} links in 'GeneratedLinks' sheet`);
  return `Created ${links.length} access links`;
}

// ============================================
// GET DAILY STATISTICS
// ============================================
function getDailyStatistics(dateStr) {
  const records = getAllAttendanceRecords();
  const targetDate = new Date(dateStr).toDateString();
  
  const dailyRecords = records.filter(r => {
    const recordDate = new Date(r.date).toDateString();
    return recordDate === targetDate;
  });
  
  let totalPresent = 0;
  let totalAbsent = 0;
  const uniqueJtos = new Set();
  
  dailyRecords.forEach(r => {
    totalPresent += r.presentCount || 0;
    totalAbsent += r.absent || 0;
    uniqueJtos.add(r.jtoId);
  });
  
  return {
    date: dateStr,
    totalRecords: dailyRecords.length,
    uniqueJtos: uniqueJtos.size,
    totalPresent: totalPresent,
    totalAbsent: totalAbsent,
    records: dailyRecords
  };
}

// ============================================
// GET MONTHLY STATISTICS
// ============================================
function getMonthlyStatistics(yearMonth) {
  const records = getAllAttendanceRecords();
  const [year, month] = yearMonth.split('-').map(Number);
  
  const monthlyRecords = records.filter(r => {
    const recordDate = new Date(r.date);
    return recordDate.getFullYear() === year && 
           (recordDate.getMonth() + 1) === month;
  });
  
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalRecords = monthlyRecords.length;
  const uniqueJtos = new Set();
  const tradeStats = {};
  
  monthlyRecords.forEach(r => {
    totalPresent += r.presentCount || 0;
    totalAbsent += r.absent || 0;
    uniqueJtos.add(r.jtoId);
    
    // Trade statistics
    if (!tradeStats[r.trade]) {
      tradeStats[r.trade] = { count: 0, present: 0, absent: 0 };
    }
    tradeStats[r.trade].count++;
    tradeStats[r.trade].present += r.presentCount || 0;
    tradeStats[r.trade].absent += r.absent || 0;
  });
  
  return {
    month: yearMonth,
    totalRecords: totalRecords,
    uniqueJtos: uniqueJtos.size,
    totalPresent: totalPresent,
    totalAbsent: totalAbsent,
    tradeStats: tradeStats
  };
}

// ============================================
// EXPORT ATTENDANCE TO CSV
// ============================================
function exportAttendanceToCSV(dateFrom, dateTo) {
  const records = getAllAttendanceRecords();
  const startDate = new Date(dateFrom).getTime();
  const endDate = new Date(dateTo).getTime();
  
  const filteredRecords = records.filter(r => {
    const recordDate = new Date(r.date).getTime();
    return recordDate >= startDate && recordDate <= endDate;
  });
  
  // Create CSV header
  let csv = 'Date,JTO ID,Name,Email,Trade,Unit,Subject,Sanctioned,Onroll,Present,Absent,Submitted At\n';
  
  // Add data rows
  filteredRecords.forEach(r => {
    const date = new Date(r.date).toLocaleDateString();
    const submittedAt = new Date(r.submittedAt).toLocaleString();
    
    csv += `"${date}","${r.jtoId}","${r.name}","${r.email}","${r.trade}","${r.unit}","${r.subject}",${r.sanctioned},${r.onroll},${r.presentCount},${r.absent},"${submittedAt}"\n`;
  });
  
  return csv;
}
