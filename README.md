# FactFlow Check Beta

FactFlow Check Beta is a beta version of FactFlow Check with Google Sheets integration. Students enter their name at the start and send their results directly to the teacher's Google Sheet when they finish.

## What's new in Beta

### Student name entry
Students type their name before starting the check. Names are normalised (capitalisation and spacing are cleaned up automatically) and remembered on each device for future sessions.

### Send Results button
After completing a check, the result screen shows a **Send Results** button alongside the existing Done button. Pressing it sends the student's full result to the teacher's Google Sheet.

### Google Sheets integration
Results land in a Google Sheet with two tabs:

- **Summary** — one row per student, sorted A–Z, showing only the most recent check. A student's row updates in place each time they submit. This is the tab the teacher checks during class.
- **Raw Data** (hidden) — every submission ever sent, timestamped. A full chronological record.

Multiple submits from the same student are safe — the Summary row just refreshes with the latest data. The Raw Data sheet keeps everything.

### Leave reminder
If a student tries to close the tab or navigate away from the result screen without pressing Submit, the browser shows a reminder: *"Your results have not been sent. Press Submit to send them to your teacher."*

### Clipboard fallback
If the Google Sheets server is unreachable (offline, network issue), results are automatically copied to the clipboard instead. The student can paste them into an email or chat.

## Setup

See **SETUP-GUIDE.md** for step-by-step instructions. In short:

1. Create a blank Google Sheet
2. Paste `factflow-apps-script.gs` into Extensions → Apps Script
3. Deploy as a web app (Anyone can access)
4. Copy the URL into the `SUBMIT_URL` constant in `index.html`
5. Host `index.html` (the teacher in this beta hosts it at `ffcbeta.mtomlinson.ca`)

No backend, no API keys, no paid services. The Apps Script runs under your Google account.

## Assessment approach

Same as FactFlow Check. The Beta uses the identical assessment engine — same bands, same scoring, same warm-up, same fast-track and standard paths. The only differences are the name field, the Send Results button, and the leave reminder.

## Response categories

- Correct under 4 seconds: fluent
- Correct in 4 to 8 seconds: known but slow
- Correct after 8 seconds: not fluent
- Wrong answer: needs practice
- Timeout: needs practice

## Fact bands

- Band A: 2s, 5s, 10s
- Band B: 3s, 4s
- Band C: 6s
- Band D: 7s
- Band E: 8s
- Band F: 9s
- Band G: 11s, 12s
- Band H: Mixed 2-12

## One-code-per-attempt lock

Each code can only be used once per device. Once a student completes a check with a given code on a particular machine, that code is locked on that device until the teacher clears the saved results.

## Teacher tools

The teacher area is behind a passphrase (default: `strawberry`). It allows:

- Setting the assessment name
- Setting or generating a custom code
- Reviewing saved results on the device
- Clearing saved results and local attempt locks

The Submit URL is configured in the code (`SUBMIT_URL` constant near line 371), not in the teacher panel. An information notice in the teacher panel explains where to find it.

## Classroom workflow

1. Teacher opens Teacher Tools and confirms the assessment name and code.
2. Students open the app, enter their name and the teacher code, then click Begin.
3. A 3-2-1 countdown appears, then the check starts.
4. Students complete the check independently.
5. The result screen appears. Student presses **Send Results**.
6. The teacher checks the Google Sheet Summary tab to see all results.
7. Student taps Done to return to the entry screen for the next student.

## Beta vs stable

| Feature | FactFlow Check (stable) | FactFlow Check Beta |
|---------|------------------------|---------------------|
| Student name | Not collected | Typed at start, normalised |
| Result delivery | Teacher reads screen | Sent to Google Sheets |
| Multiple submits | N/A | Safe — row updates in place |
| Leave reminder | No | Warns if navigating away unsent |
| Data storage | Separate localStorage keys | Separate localStorage keys |
| Assessment engine | Identical | Identical |

## Files

- `index.html` — the complete FactFlow Check Beta app
- `factflow-apps-script.gs` — Google Apps Script for the Sheet (copy-paste into your Sheet)
- `SETUP-GUIDE.md` — step-by-step teacher setup instructions
- `*.png` — app icons and logo
