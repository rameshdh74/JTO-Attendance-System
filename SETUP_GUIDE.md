# JTO Attendance System - Complete Setup Guide

## 🎯 Overview
A secure, mobile-responsive attendance tracking system for JTOs (Job Training Officers) with:
- ✅ Email-based authentication
- ✅ Pre-filled master data (Trade, Unit, Subjects)
- ✅ Duplicate submission prevention
- ✅ Automatic absent count calculation
- ✅ Admin dashboard with filtering & export
- ✅ Multi-subject support with dynamic dropdowns

---

## 📋 System Requirements

### Google Workspace
- Google Account with access to Google Sheets and Apps Script
- Your Google Sheet with master data

### Master Data Sheet Structure
**Sheet Name:** `MasterData`

| Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| JTO ID | Email ID | Name of JTO | Trade | Shift | Unit | Sanctioned | Onroll | Subjects |
| JTO001 | jto1@email.com | John Doe | Electrical | Morning | Unit1,Unit2,Unit3 | 30 | 28 | Trade Theory,Trade Practical |
| JTO002 | jto2@email.com | Jane Smith | Mechanical | Evening | Unit1,Unit2 | 25 | 24 | Engg Drawing |

### Attendance Sheet (Auto-created)
**Sheet Name:** `Attendance`

| Date | JTO ID | Email | Name | Trade | Unit | Subject | Sanctioned | Onroll | Present Count | Absent | Timestamp |
|------|--------|-------|------|-------|------|---------|-----------|--------|---------------|--------|-----------|

---

## 🚀 Setup Instructions

### Step 1: Create Google Sheet
1. Create a new Google Sheet
2. Rename first sheet to `MasterData`
3. Add column headers as shown above
4. Fill in your JTO data

### Step 2: Set Up Google Apps Script

#### Option A: Copy-Paste Method (Simple)

1. Open your Google Sheet
2. Go to **Tools → Apps Script**
3. Delete the default code
4. Copy and paste the following files from the repository:
   - `Code.gs` - Main backend
   - `Admin.gs` - Admin functions
   - Create file `index.html` - User interface
   - Create file `admin.html` - Admin dashboard

#### Option B: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/rameshdh74/JTO-Attendance-System.git

# Copy files to your Apps Script project
```

### Step 3: Deploy as Web App

1. In Apps Script editor, click **Deploy → New deployment**
2. Select type: **Web app**
3. Execute as: Your email
4. Who has access: **Anyone**
5. Copy the deployment URL
6. Click **Deploy**

---

## 📱 User Access (JTO Link Generation)

### Generate User Links
Each JTO gets a unique link with their JTO ID and email:

```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb?jtoId=JTO001&email=jto1@email.com
```

### Send Links to JTOs
1. Create a script to generate and email links to JTOs
2. Or manually create links for each JTO from master data
3. Share links via email or WhatsApp

---

## 🔐 Security Features

### Email-Based Access Control
- Only authorized emails can access
- JTO ID must match email in master data
- One unique link per JTO

### Data Isolation
- Users only see their own data
- Cannot view other users' submissions
- Cannot edit submitted records

### Validation
✅ Present count cannot exceed Onroll  
✅ Duplicate submission prevention  
✅ Date validation  
✅ Unit & Subject validation  

---

## 📋 JTO Workflow

### For JTOs with Multiple Subjects (Trade Theory + Trade Practical)

1. **Open Link** → Authenticates via email & JTO ID
2. **Select Date** → Pick attendance date (default: today)
3. **Select Trade** → From dropdown
4. **Select Unit** → From their assigned units (1-8)
5. **Select Subject** → Trade Theory or Trade Practical
6. **View Capacity** → See Sanctioned & Onroll from master data
7. **Enter Present Count** → Validation: ≤ Onroll
8. **Submit** → Absent auto-calculated (Onroll - Present)
9. **Mark Another** → Button appears to enter another subject
10. **Duplicate Check** → System prevents re-entry for same subject/date

### For JTOs with Single Subject (Engg Drawing, WorkSci/Calc, Employability Skill)

1. **Open Link** → Auto-authenticates
2. **Select Date** → Default: today
3. **Select Unit** → From dropdown (required)
4. **Subject Auto-Selected** → Engg Drawing (or assigned subject)
5. **Shift Auto-Selected** → From master data
6. **Enter Present Count** → ≤ Onroll
7. **Submit** → Absent auto-calculated

---

## 👨‍💼 Admin Dashboard Access

### Open Admin Dashboard
```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb?admin=true
```

### Admin Features
- 📊 View all attendance records
- 🔍 Filter by Date, JTO ID, Subject
- 📊 Statistics: Total Records, Unique JTOs, Total Present/Absent
- 📥 Export to CSV
- 🔄 Real-time updates

---

## 🛠️ Technical Architecture

### Backend (Code.gs)
- **doGet()** - Authenticates users and serves form
- **getMasterDataByEmail()** - Retrieves JTO details
- **submitAttendance()** - Validates and stores data
- **checkDuplicateSubmission()** - Prevents re-submission
- **getSanctionedOnrollByTradeUnit()** - Gets capacity values

### Frontend (index.html)
- Mobile-responsive UI
- Dynamic dropdown population
- Client-side validation
- Real-time error messages
- Auto-calculation of absent count

### Admin (admin.html)
- Dashboard with statistics
- Filterable attendance records
- CSV export functionality
- Real-time data sync

---

## 📱 Mobile Installation

### Android
1. Receive link via email/WhatsApp
2. Open in any browser (Chrome, Firefox, etc.)
3. Can bookmark for quick access
4. Works offline (if cached)

### iOS (iPhone/iPad)
1. Receive link via email/WhatsApp
2. Open in Safari or any browser
3. Tap "Share" → "Add to Home Screen" (web app install)
4. Opens like a native app

---

## 🐛 Troubleshooting

### "Access Denied" Error
**Problem:** Email not found in master data  
**Solution:** Verify email in master data matches exactly (case-sensitive)

### "JTO ID does not match email"
**Problem:** Wrong JTO ID in URL  
**Solution:** Regenerate link with correct JTO ID

### "Attendance already submitted"
**Problem:** Trying to submit same subject twice on same day  
**Solution:** Select a different subject or change the date

### "Present count exceeds Onroll"
**Problem:** Entered present count > onroll value  
**Solution:** Enter a smaller number ≤ onroll value

### Links not working after deployment
**Problem:** Deployment URL changed  
**Solution:** Re-deploy and get new URL

---

## 📊 Data Storage & Backup

### Attendance Data Location
- Stored in `Attendance` sheet automatically
- Each row = one submission record
- Includes: Date, JTO ID, Email, Trade, Unit, Subject, Present, Absent

### Backup Strategy
1. Download sheet as Excel weekly
2. Archive old sheets monthly
3. Keep master data separate

---

## 🔄 Monthly Maintenance

1. **Review Submissions** - Check for anomalies
2. **Update Master Data** - Add new JTOs, remove inactive ones
3. **Archive Old Data** - Move completed months to archive sheet
4. **Export Reports** - Generate monthly attendance reports

---

## 📞 Support & Contact

For issues or customizations:
- Check troubleshooting section above
- Review master data format
- Verify deployment settings
- Check browser console for errors

---

## 📄 License
Free to use and modify for your organization.

---

## 🎉 Features Summary

| Feature | Status |
|---------|--------|
| Email-based Authentication | ✅ |
| Pre-filled Master Data | ✅ |
| Multiple Subjects Support | ✅ |
| Multiple Units Support (up to 8) | ✅ |
| Automatic Absent Calculation | ✅ |
| Duplicate Submission Prevention | ✅ |
| Present Count Validation | ✅ |
| Admin Dashboard | ✅ |
| CSV Export | ✅ |
| Mobile Responsive | ✅ |
| Data Isolation | ✅ |
| Real-time Statistics | ✅ |

---

**Version:** 1.0  
**Last Updated:** 2026-09-13  
**System:** JTO Attendance Tracker
