// ============================================
// JTO ATTENDANCE SYSTEM - BACKEND
// ============================================

const MASTER_SHEET = "MasterData";
const ATTENDANCE_SHEET = "Attendance";

// ============================================
// 1. DOGET - Serve the HTML interface
// ============================================
function doGet(e) {
  const jtoId = e.parameter.jtoId;
  const email = e.parameter.email;
  
  // Verify access rights
  if (!jtoId || !email) {
    return HtmlService.createHtmlOutput('<h2>Invalid Access</h2><p>Missing JTO ID or Email</p>');
  }
  
  const masterData = getMasterDataByEmail(email);
  if (!masterData) {
    return HtmlService.createHtmlOutput('<h2>Access Denied</h2><p>Email not found in system or JTO ID mismatch</p>');
  }
  
  // Verify JTO ID matches email
  if (masterData.jtoId !== jtoId) {
    return HtmlService.createHtmlOutput('<h2>Access Denied</h2><p>JTO ID does not match email</p>');
  }
  
  const html = HtmlService.createTemplateFromFile('index');
  html.jtoData = masterData;
  return html.evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ============================================
// 2. Get Master Data by Email
// ============================================
function getMasterDataByEmail(email) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) { // Column B = Email
      return {
        jtoId: data[i][0],           // Column A
        email: data[i][1],            // Column B
        name: data[i][2],             // Column C
        trade: data[i][3],            // Column D
        shift: data[i][4],            // Column E
        units: parseUnits(data[i][5]),// Column F (can have multiple)
        sanctioned: data[i][6],       // Column G
        onroll: data[i][7],           // Column H
        subjects: parseSubjects(data[i][8]) // Column I
      };
    }
  }
  return null;
}

// ============================================
// 3. Parse Units (comma-separated or individual)
// ============================================
function parseUnits(unitString) {
  if (!unitString) return [];
  return unitString.toString().split(',').map(u => u.trim()).filter(u => u !== '');
}

// ============================================
// 4. Parse Subjects (comma-separated)
// ============================================
function parseSubjects(subjectString) {
  if (!subjectString) return [];
  return subjectString.toString().split(',').map(s => s.trim()).filter(s => s !== '');
}

// ============================================
// 5. Get Sanctioned & Onroll for Trade + Unit
// ============================================
function getSanctionedOnrollByTradeUnit(trade, unit) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(MASTER_SHEET);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === trade) { // Column D = Trade
      const units = parseUnits(data[i][5]);
      if (units.includes(unit)) {
        return {
          sanctioned: data[i][6],
          onroll: data[i][7]
        };
      }
    }
  }
  return null;
}

// ============================================
// 6. Check for Duplicate Submission
// ============================================
function checkDuplicateSubmission(jtoId, subject, unit, date) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(ATTENDANCE_SHEET);
  const data = sheet.getDataRange().getValues();
  
  const dateStr = new Date(date).toDateString();
  
  for (let i = 1; i < data.length; i++) {
    const recordDate = new Date(data[i][0]).toDateString();
    if (data[i][1] === jtoId && 
        data[i][6] === subject && 
        data[i][5] === unit && 
        recordDate === dateStr) {
      return true; // Duplicate found
    }
  }
  return false; // No duplicate
}

// ============================================
// 7. Submit Attendance
// ============================================
function submitAttendance(formData) {
  try {
    const { jtoId, email, name, trade, unit, subject, sanctioned, onroll, presentCount, date } = formData;
    
    // Validate present count
    if (presentCount > onroll) {
      return {
        success: false,
        error: `Present count (${presentCount}) cannot exceed Onroll (${onroll})`
      };
    }
    
    // Check for duplicate submission
    if (checkDuplicateSubmission(jtoId, subject, unit, date)) {
      return {
        success: false,
        error: `Attendance already submitted for ${subject} on ${date}. Cannot submit duplicate.`
      };
    }
    
    // Calculate absent
    const absent = onroll - presentCount;
    
    // Get attendance sheet
    const sheet = SpreadsheetApp.getActive().getSheetByName(ATTENDANCE_SHEET);
    
    // Append new row
    sheet.appendRow([
      new Date(date),  // Date
      jtoId,           // JTO ID
      email,           // Email
      name,            // Name
      trade,           // Trade
      unit,            // Unit
      subject,         // Subject
      sanctioned,      // Sanctioned
      onroll,          // Onroll
      presentCount,    // Present Count
      absent,          // Absent (auto-calculated)
      new Date()       // Submission Timestamp
    ]);
    
    return {
      success: true,
      message: `Attendance submitted successfully for ${subject}`
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error.message}`
    };
  }
}

// ============================================
// 8. Get Submitted Subjects for the Day
// ============================================
function getSubmittedSubjectsToday(jtoId, date) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(ATTENDANCE_SHEET);
  const data = sheet.getDataRange().getValues();
  
  const dateStr = new Date(date).toDateString();
  const submitted = [];
  
  for (let i = 1; i < data.length; i++) {
    const recordDate = new Date(data[i][0]).toDateString();
    if (data[i][1] === jtoId && recordDate === dateStr) {
      submitted.push({
        subject: data[i][6],
        unit: data[i][5],
        presentCount: data[i][9]
      });
    }
  }
  
  return submitted;
}
