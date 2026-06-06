# FactFlow Check Beta — Teacher Setup Guide

## One-time setup (about 5 minutes)

### Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank spreadsheet**
3. Title it "FactFlow Results" (or anything you like)

### Step 2: Add the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any starter code that appears
3. Copy the **entire contents** of `factflow-apps-script.gs` (provided in this folder)
4. Paste it into the Apps Script editor
5. Click the save icon (💾) or press **Ctrl+S**
6. Name the project "FactFlow Receiver" when prompted

### Step 3: Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New Deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Set these values:
   - **Description:** `FactFlow Check Beta receiver`
   - **Execute as:** `Me` (your Google account)
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Click **Authorize access** (Google will ask — safe, only accesses your Sheet)
6. **Copy the URL** that appears. It looks like:
   ```
   https://script.google.com/macros/s/AKfycbyx.../exec
   ```
7. Click **Done**

### Step 4: Add the URL to the HTML

1. Open `index.html` in a text editor (Notepad, VS Code, or any plain-text editor)
2. Find the line near the top that says:
   ```js
   var SUBMIT_URL = 'https://script.google.com/macros/s/.../exec';
   ```
3. Replace the URL between the quotes with the URL you copied in Step 3
4. Save the file

### Step 5: Upload and test

1. Upload the updated `index.html` to your hosting (e.g., `ffcbeta.mtomlinson.ca`)
2. Open the app, enter a student name and a valid teacher code, complete a check
3. On the result screen, click **Send Results**
4. Open your Google Sheet — you should see:
   - **Raw Data** sheet (hidden): every submission, timestamped
   - **Summary** sheet (visible): one row per student, alphabetical, showing only the latest result

---

## When you redeploy the Apps Script

If you edit the Apps Script later, you must:

1. Click **Deploy → New Deployment** (a new deployment, not just save)
2. Copy the **new URL** it gives you
3. Update the `SUBMIT_URL` in `index.html` with the new URL
4. Re-upload `index.html`

Each deployment gets a unique URL. The old URL stops working once a new deployment is created.

---

## How it works

| Student clicks... | What happens |
|---|---|
| **Send Results** | Posts their result to your Sheet. Row appears in Summary instantly. |
| (offline / server error) | Falls back to copying results to clipboard with a toast message. |

## Sheet structure

**Raw Data** (hidden — full chronological log):
- Timestamp, Student, Code, Assessment, Verified, Developing, Accuracy, Fluent, Slow, Wrong, Timeout, Questions, Missed Facts, Restarted, Duration

**Summary** (what you look at):
- Student, Date, Code, Verified, Developing, Accuracy, Fluent, Slow, Missed, Facts to Review, Restart?
- One row per student
- Automatically sorted A–Z
- Each new submission updates that student's row in place

---

## Troubleshooting

**"Could not reach server" message:**
Check that the student's device has internet. If they're offline, results are copied to clipboard — they can paste into an email later.

**"Server error" message:**
The Apps Script may have a bug. Go to Extensions → Apps Script in your Sheet, click **Executions** in the left sidebar, and look for errors. Redeploy after fixing.

**Duplicate entries for the same student:**
Name normalization handles case and spacing, but not typos (e.g., "Ben" vs "Bne"). Remind the student to correct their spelling — the name is remembered on their device for next time.

**URL changed after redeploying:**
If you redeploy the Apps Script, you get a new URL. You must update `SUBMIT_URL` in `index.html` and re-upload. The old URL stops working.
