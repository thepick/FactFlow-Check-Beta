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
   https://script.google.com/macros/s/ABC123xyz.../exec
   ```
7. Click **Done**

### Step 4: Configure FactFlow Check Beta

1. Open `index.html` in your browser
2. Click the **Teacher** button (top right)
3. Enter the teacher passphrase (default: `strawberry`)
4. In the **Submit URL** field, paste the URL you copied
5. Configure your assessment name and codes as usual
6. Click **Save & Exit**

### Step 5: Test

1. Enter a student name and a valid teacher code on the entry screen
2. Complete a check
3. On the result screen, click **Send Results**
4. Open your Google Sheet — you should see:
   - **Raw Data** sheet (hidden): every submission, timestamped
   - **Summary** sheet (visible): one row per student, alphabetical, showing only the latest result

---

## How it works

| Student clicks... | What happens |
|---|---|
| **Send Results** | Posts their result to your Sheet. Row appears in Summary instantly. |
| (no URL configured) | Falls back to copying results to clipboard. |
| (offline / server error) | Falls back to clipboard with a toast message. |

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

**"No submit URL configured" message:**
The URL hasn't been saved yet. Go to Teacher panel, paste the URL, and click Save & Exit.

**"Could not reach server" message:**
Check that the student's device has internet. If they're offline, results are copied to clipboard — they can paste into an email later.

**Duplicate entries for the same student:**
Name normalization handles case and spacing, but not typos (e.g., "Ben" vs "Bne"). Remind the student to correct their spelling — the name is remembered on their device for next time.
