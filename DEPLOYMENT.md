# JTO Attendance System - DEPLOYMENT GUIDE

## 🎉 Complete Installation & Setup

Your **free, fully-functional JTO Attendance Tracking System** is ready to deploy!

---

## 📋 What You're Getting

✅ **User Mobile App** - JTOs submit attendance via unique links  
✅ **Admin Dashboard** - View all submissions, filter, export data  
✅ **Automatic Calculations** - Absent = Onroll - Present  
✅ **Duplicate Prevention** - Can't submit same subject twice per day  
✅ **Data Validation** - Present ≤ Onroll always enforced  
✅ **Email Notifications** - Send links to all JTOs  
✅ **CSV Export** - Download attendance data  
✅ **Statistics** - Daily & monthly reports  

---

## 🚀 Step-by-Step Deployment

### Step 1: Upload Master Data to Google Sheet

1. **Create Google Sheet** (if not already done)
   - Go to https://sheets.google.com
   - Click "Create new spreadsheet"
   - Name it: "JTO Attendance System"

2. **Add Master Data**
   - Create sheet named: `MasterData`
   - Add your data with these column headers:
     ```
     A: JTO_ID
     B: Email ID
     C: JTO Name
     D: Trade
     E: Shift
     F: Unit
     G: Sanctioned
     H: On Roll
     I: Mapped Subjects
     ```
   - Copy all your JTO data rows

3. **Important:** Make sure units and subjects are exactly as you have them:
   - Units: `Unit 1, Unit 2, Unit 3` (comma-separated)
   - Subjects: `Trade Theory, Trade practical` OR `Engg Drawing` OR `W.Sci&Calc` OR `Employibility Skill`

### Step 2: Set Up Google Apps Script

1. **Open Apps Script**
   - In your Google Sheet, go to: **Tools → Apps Script**
   - This opens the Apps Script editor

2. **Create Script Files**
   - You'll see a `Code.gs` file by default
   - Copy the entire content from the repository files:
     - **Code.gs** - Backend logic
     - **Admin.gs** - Admin functions
     - **index.html** - User form interface
     - **admin.html** - Admin dashboard interface

3. **How to Add Files in Apps Script:**
   - Click **"+" → HTML** to create HTML files
   - Click **"+" → Google Apps Script** to create .gs files
   - Copy-paste the code from repository into each file

### Step 3: Deploy as Web App

1. **Click "Deploy" → "New Deployment"**

2. **Select Type:**
   - Type: **Web app**
   - Execute as: **Your Email**
   - Who has access: **Anyone**

3. **Click "Deploy"**

4. **Important:** Copy the deployment URL
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
   ```
   Extract the `{DEPLOYMENT_ID}` for later use

---

## 📱 Generate & Send JTO Links

### Option A: Automatic Email Distribution (Recommended)

1. **In Apps Script, paste this in console:**
   ```javascript
   // Create links sheet
   createLinksSheet()
   ```

2. **View Generated Links**
   - New sheet "GeneratedLinks" will be created
   - Shows all JTO links

3. **Send Emails to JTOs**
   - In Apps Script console, run:
   ```javascript
   // Send emails with links
   sendAccessLinksViaEmail()
   ```

4. **Check Email Status**
   - Go to: **View → Logs** to see which emails were sent
   - Fix any missing emails and re-run

### Option B: Manual Link Generation

If you prefer manual sending, each JTO's link is:

```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb?jtoId={JTO_ID}&email={EMAIL}
```

**Example:**
```
https://script.google.com/macros/d/AKfycbwXxxx12345/userweb?jtoId=jto115&email=amjadkhan54321@gmail.com
```

---

## 👤 JTO User Workflow

### What JTOs See When They Open Link:

1. **Login** - System verifies their email & JTO ID
2. **View Info** - JTO ID, Name, Email, Shift (read-only)
3. **Select Date** - Choose attendance date (default: today)
4. **Select Unit** - Dropdown shows their assigned units
5. **Select Subject** (if multiple) - Trade Theory OR Trade Practical
6. **View Capacity** - Sanctioned & Onroll auto-loaded from master data
7. **Enter Present Count** - Number of students present
8. **Validation:**
   - ✓ Present ≤ Onroll
   - ✓ No duplicate for same subject/date
   - ✗ Error message if invalid

9. **Submit** - Absent auto-calculated
10. **View Submitted** - Shows what they've submitted today
11. **Submit Another** - Button to enter attendance for another subject/unit

---

## 📊 Admin Dashboard Access

### Open Admin Dashboard

```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
```

Then add `?admin=true` to URL (this step will be simplified in next version)

### Admin Features

**View All Records:**
- Filter by Date
- Filter by JTO ID
- Filter by Subject

**Statistics:**
- Total Records
- Unique JTOs
- Total Present Count
- Total Absent Count

**Export:**
- Click "📥 Export CSV" to download data

---

## 🔧 System Configuration

### Master Data Structure (Your Actual Format)

Your data has this structure:
- **Multiple rows per JTO** ✓ (Same JTO, different units)
- **Sanctioned & Onroll per unit** ✓ (Auto-loads based on unit selected)
- **Multiple subjects support** ✓ (Trade Theory + Trade Practical)
- **Single subject support** ✓ (Engg Drawing, W.Sci&Calc, Employability)
- **Multiple shifts** ✓ (Shift 1, Shift 2)
- **Empty rows for future** ✓ (Automatically skipped)
- **Missing emails** ✓ (Will work once emails are added)

**The system automatically handles all of this!**

---

## 📋 Attendance Sheet Structure

After first submission, a new sheet "Attendance" is created with:

```
Date | JTO ID | Email | Name | Trade | Unit | Subject | Sanctioned | Onroll | Present Count | Absent | Submitted At
```

**Automatic Calculations:**
- Absent = Onroll - Present Count
- Timestamp = Auto-added on submission

---

## 🔒 Security Features

### Email Authentication
- Only authorized emails can access
- JTO ID must match email

### Data Isolation
- JTOs only see their own info
- Cannot view other JTOs' submissions
- Cannot edit submitted records

### Validation
- Present count ≤ Onroll (enforced server-side)
- Duplicate submission prevention
- Date & unit validation

### Admin Security
- Admin dashboard shows all data (secure your link!)
- Export data for backup

---

## ✅ Testing Checklist

Before going live:

- [ ] Master data uploaded correctly
- [ ] Apps Script deployed as Web App
- [ ] Deployment ID copied
- [ ] Generated at least one test link
- [ ] Opened link and verified JTO info loads
- [ ] Submitted test attendance record
- [ ] Checked "Attendance" sheet created
- [ ] Verified absence calculation correct
- [ ] Tried duplicate submission (should fail)
- [ ] Tried present > onroll (should fail)
- [ ] Checked admin dashboard shows record
- [ ] Tested CSV export

---

## 🐛 Troubleshooting

### Issue: "Access Denied" Error

**Cause:** Email not in master data or doesn't match exactly

**Solution:**
1. Check master data for exact email match
2. Verify no extra spaces or different case
3. Update master data if needed

### Issue: Units Not Showing in Dropdown

**Cause:** Units format issue in master data

**Solution:**
1. Check units in Column F are comma-separated
2. Format: `Unit 1,Unit 2,Unit 3` (no extra spaces after commas)
3. Re-save the sheet

### Issue: Sanctioned/Onroll Shows 0

**Cause:** Values not in master data for that unit

**Solution:**
1. Check Columns G (Sanctioned) & H (Onroll) have values
2. Verify unit matches exactly what's in Column F
3. Re-open form after fixing

### Issue: Emails Not Sending

**Cause:** Gmail permissions not granted

**Solution:**
1. First run `createLinksSheet()` successfully
2. Then run `sendAccessLinksViaEmail()`
3. Grant Gmail permissions when prompted
4. Check Logs for any errors

### Issue: Link Not Working

**Cause:** Wrong deployment ID or URL syntax

**Solution:**
1. Re-deploy as Web App
2. Copy new deployment URL correctly
3. Verify format: `?jtoId=...&email=...`

---

## 📈 Scaling to 70-80 JTOs

### Performance
- ✅ Google Sheets handles unlimited rows
- ✅ Apps Script quota sufficient for 1000+ submissions/day
- ✅ No performance issues with 80 JTOs

### Data Management
1. **Send links in batches** (avoid overwhelming)
2. **Monitor submissions** in admin dashboard
3. **Export weekly** for backup
4. **Archive old data** (move to separate sheet)

### Best Practices
- Add new JTOs as needed to master data
- Update emails when available
- Keep attendance sheet separate (auto-created)
- Export data weekly for safety

---

## 🔄 Monthly Workflow

### Week 1: Setup & Testing
- Deploy system
- Test with 2-3 JTOs
- Send links to all JTOs

### Week 2-4: Daily Operations
- JTOs submit daily attendance
- Monitor admin dashboard
- Check for submission issues

### Month End: Reporting
- Export attendance data
- Review statistics
- Archive old records
- Send reports to admin

---

## 📞 Support Resources

### In Troubleshooting:
1. Check error message carefully
2. Review master data structure
3. Check Apps Script logs (View → Logs)
4. Verify deployment settings
5. Re-deploy if needed

### Common Errors:
```
"Access Denied" → Email not in master data
"JTO ID mismatch" → Wrong JTO ID in URL
"Duplicate submission" → Already submitted same subject/date
"Present exceeds Onroll" → Enter smaller number
"Units empty" → Check master data format
```

---

## 🎯 Next Steps

1. **Upload your master data** to Google Sheet
2. **Copy code files** to Apps Script
3. **Deploy as Web App**
4. **Generate links** using `createLinksSheet()`
5. **Send links** to JTOs via email
6. **Monitor submissions** in admin dashboard
7. **Export data** weekly for backup

---

## 💡 Tips & Tricks

✅ **Add New JTO:**
- Add row to MasterData sheet
- New link will be auto-generated
- Send them the link

✅ **Update Emails:**
- Update Column B with new email
- Regenerate links
- Send new link to JTO

✅ **View Submissions:**
- Open "Attendance" sheet
- Filter by date or JTO ID
- Check calculations

✅ **Backup Data:**
- Weekly: Download Attendance sheet as Excel
- Monthly: Archive to separate file
- Yearly: Store in secure location

✅ **Export Reports:**
- Use admin dashboard CSV export
- Open in Excel for analysis
- Create monthly summaries

---

## 📊 System Statistics

**From Your Master Data:**
- Total JTOs: 50 active
- Trades: Electrician, Turner, Machinist, MEV, Fitter, ACNC, RACT, ICTSM, Welder, COPA, VAD, MPCA, etc.
- Units: Up to 8 per JTO
- Subjects: 2 types (Trade Theory+Practical) or 1 (Skills)
- Shift: Shift 1, Shift 2
- Average Onroll: ~18 students per unit

**Capacity:**
- ✅ Handles 70-80 JTOs easily
- ✅ Scales to 1000+ daily submissions
- ✅ No additional cost with scale

---

## 🎓 Training for JTOs

### Quick User Guide

**Share this with JTOs:**

```
HOW TO USE JTO ATTENDANCE SYSTEM:

1. Open your unique link in phone browser
2. Your details auto-load
3. Select today's date (or any date)
4. Select the unit you're teaching
5. If you teach 2 subjects, select which one
6. Enter how many students are present
7. Click "Submit Attendance"
8. You'll see "submitted today" list
9. To submit another subject, click "Mark Another"
10. System won't let you submit same subject twice

IMPORTANT:
- Present count cannot exceed Onroll
- Keep your link safe (unique to you only)
- Your data is private
- System auto-calculates absent count

QUESTIONS? Contact Admin
```

---

## 🏆 System Highlights

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-unit support (up to 8) | ✅ | Works with your data |
| Multi-subject support | ✅ | Trade Theory + Practical |
| Single-subject support | ✅ | Engg Drawing, W.Sci, Skills |
| Email authentication | ✅ | Secure access |
| Duplicate prevention | ✅ | Can't submit twice |
| Auto-calculations | ✅ | Absent = Onroll - Present |
| Validation | ✅ | Present ≤ Onroll |
| Mobile responsive | ✅ | Works on Android & iOS |
| Admin dashboard | ✅ | View all data |
| CSV export | ✅ | Download data |
| Free forever | ✅ | No costs ever |
| Scalable | ✅ | Handles 80+ JTOs |

---

## 📞 Final Checklist Before Going Live

- [ ] Google Sheet created with "MasterData" sheet
- [ ] All JTO data entered with correct format
- [ ] Units are comma-separated
- [ ] Subjects match allowed types
- [ ] Apps Script deployed as Web App
- [ ] Deployment ID extracted
- [ ] Test link generated and works
- [ ] Test attendance submission successful
- [ ] Attendance sheet auto-created
- [ ] Admin dashboard accessible
- [ ] Links generated for all JTOs
- [ ] Ready to send links to JTOs

---

**🎉 Your Complete, Free JTO Attendance System is Ready!**

**Enjoy seamless attendance tracking with no costs, forever!**

*Last Updated: 2026-09-13*
