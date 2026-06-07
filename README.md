# FactFlow Check

FactFlow Check is a separate supervised assessment app for multiplication fact placement. It is designed to be used alongside [FactFlow](https://github.com/thepick/FactFlow) for regular multiplication fact practice. FactFlow Check does not use regular FactFlow practice progress as proof of mastery.

The purpose of FactFlow Check is to give the teacher a quick, structured snapshot of a student's multiplication fact fluency. It is not meant to replace classroom observation, normal practice, or teacher judgment. It is meant to help place students at a reasonable starting point for multiplication fact practice.

## Features

### Student name entry
Students type their name before starting the check. Names are normalised (capitalisation and spacing are cleaned up automatically) and remembered on each device for future sessions.

### Send Results button
After completing a check, the result screen shows a **Send Results** button. Pressing it sends the student's full result to the teacher's Google Sheet.

### Multi-teacher support
A single hosted app serves multiple teachers. Each teacher gets their own Google Sheet and shares a unique link with their class:

- `ffcbeta.mtomlinson.ca/?t=IP5/9` → Ajarn Michael's class
- `ffcbeta.mtomlinson.ca/?t=IP5/8` → Ajarn Jordan's class

The teacher mapping is configured in the `TEACHERS` object near the top of `index.html`. Adding a new teacher is a one-line entry.

### Google Sheets integration
Results land in a Google Sheet with two tabs:

- **Summary** — one row per student, sorted A–Z, showing only the most recent check. A student's row updates in place each time they submit. This is the tab the teacher checks during class.
- **Raw Data** (hidden) — every submission ever sent, timestamped. A full chronological record.

Multiple submits from the same student are safe — the Summary row just refreshes with the latest data. The Raw Data sheet keeps everything.

### Leave reminder
If a student tries to close the tab or navigate away from the result screen without pressing Submit, the browser shows a reminder: *"Your results have not been sent. Press Submit to send them to your teacher."*

### Clipboard fallback
If the Google Sheets server is unreachable (offline, network issue), results are automatically copied to the clipboard instead. The student can paste them into an email or chat.

## Assessment approach

FactFlow Check assesses both accuracy and fluency.

A student who answers correctly is showing knowledge of the fact. A student who answers correctly and quickly is showing stronger evidence that the fact is automatic. This matters because multiplication fact fluency is not only about eventually finding the answer. It is also about recalling the answer quickly enough that the student can use it while solving larger math problems.

The app uses a 10-second question limit, but the full 10 seconds is not treated as fluent recall. The 10-second limit gives students time to respond, while the response speed categories help the app decide how strong the evidence is.

## Response categories

Each answer is classified internally for scoring. Students only see a green or red border on the answer box — no text feedback appears during the check.

- Correct under 4 seconds: fluent
- Correct in 4 to 8 seconds: known but slow
- Correct after 8 seconds: not fluent
- Wrong answer: needs practice
- Timeout: needs practice

Accuracy matters most. However, fast correct answers provide stronger evidence that the student has automatic recall.

## Why speed is included

A student may know a multiplication fact but still need to count, skip-count, or use another strategy to find the answer. That is useful math thinking, but it is not yet fluent recall.

FactFlow Check is designed to estimate placement for fact practice, so it gives more credit to facts that are answered quickly and correctly. This helps separate:

- facts the student has already mastered
- facts the student knows but has not made automatic yet
- facts that need practice

This allows the app to place students without forcing every student to answer every possible multiplication fact.

## Fact bands

The assessment is organized into fact bands. Each band represents a set of related multiplication facts.

- Band A: 2s, 5s, 10s
- Band B: 3s, 4s
- Band C: 6s
- Band D: 7s
- Band E: 8s
- Band F: 9s
- Band G: 11s, 12s
- Band H: Mixed 2-12

The bands move from facts that are usually easier or more familiar toward facts that are often harder for students. This lets the app build evidence step by step instead of giving a long random test.

## Warm-up

The check begins with a brief 3-2-1 countdown to give the student a moment to prepare, followed by a 6-question warm-up.

The warm-up gives the app an early sense of whether the student is ready for the faster placement path or whether the student should use the standard adaptive path.

If the student answers the warm-up correctly and fluently, the app treats Band A as verified from warm-up evidence and moves the student into the fast-track path.

If the warm-up does not provide strong enough evidence, the student uses the standard path.

## Fast-track path

The fast-track path is for students who show strong early evidence of fluency.

In fast-track mode:

- Bands B through G begin with 6-question gateway blocks.
- A strong fluent gateway result moves the student up to the next band.
- An unclear gateway result adds 4 more questions from the same band.
- A weak gateway result stops the climb.
- Band H uses an 18-question mixed 2-12 check.

The fast-track path allows a very strong student to reach the highest placement within the 60-question cap.

A full fast-track check can use:

- Warm-up: 6 questions
- Bands B-G: 6 bands × 6 questions = 36 questions
- Band H: 18 questions
- Total: 60 questions

This design keeps the check short enough for classroom use while still allowing strong students to show that they are ready for advanced mixed-fact practice.

## Standard path

Students who do not qualify for the fast-track path use the regular adaptive path.

In the standard path:

- Each band starts with 8 questions.
- If the result is unclear, the app adds 4 more questions from the same band.
- If the result is strong, the student moves up.
- If the result is weak, the climb stops.
- The app can finish early when it has enough evidence.
- The app does not start a band if there is not enough question budget left to complete it properly.

This path gives students more chances within each band before the app makes a placement decision.

## Question cap

The assessment has a maximum of 60 questions.

The cap helps keep the check practical for classroom use. It also prevents struggling students from being pushed through too many questions after the app already has enough evidence for placement.

Before starting a new band, the app checks whether there is enough question budget left to complete that band in a meaningful way. This prevents the app from starting a section it cannot properly finish.

## Placement result

The final result is based on the highest band where the app has enough evidence that the student is accurate and fluent. Each attempted band is shown in the band summary with a verdict of Passed or Developing.

The result should be read as a placement recommendation, not a permanent label. A student may still know some facts above the placement level, and a teacher may adjust placement using classroom knowledge.

The result is intended to answer this question:

"What is the highest multiplication fact level where this student has shown enough accuracy and fluency to begin practice confidently?"

## One-code-per-attempt lock

The app uses a local attempt lock. Each code can only be used once per device. Once a student completes a check with a given code on a particular machine, that code is locked on that device until the teacher clears the saved results.

This is a classroom barrier, not a secure online login. A different browser, cleared storage, or another device can bypass it.

## Teacher tools

The teacher area is behind a passphrase (default: `strawberry`). It allows:

- Setting the assessment name
- Setting or generating a custom code
- Reviewing saved results on the device
- Clearing saved results and local attempt locks

The Google Sheets URL for each teacher is configured in the `TEACHERS` object near the top of the `<script>` section in `index.html`, not in the teacher panel. An information notice in the teacher panel explains where to find it.

The result after a student finishes does not require the teacher passphrase.

## Suggested classroom workflow

1. Teacher shares their class link (e.g. `ffcbeta.mtomlinson.ca/?t=IP5/9`) with students.
2. Teacher opens Teacher Tools and confirms the assessment name and code.
3. Students open the link, enter their name and the teacher code, then click Begin.
4. A 3-2-1 countdown appears, then the check starts.
5. Students complete the check independently.
6. The result screen appears. Student presses **Send Results**.
7. The teacher checks the Google Sheet Summary tab to see all results.
8. Student taps Done to return to the entry screen for the next student.

## Setup

See **SETUP-GUIDE.md** for step-by-step instructions. In short:

1. Each teacher creates a blank Google Sheet
2. Paste the Apps Script (see SETUP-GUIDE.md) into Extensions → Apps Script
3. Deploy as a web app (Execute as: Me, Anyone can access)
4. Copy the deployment URL
5. Add an entry to the `TEACHERS` object in `index.html` with the teacher's key, name, and URL
6. The teacher shares `ffcbeta.mtomlinson.ca/?t=KEY` with their class
7. Upload `index.html` to hosting

No backend, no API keys, no paid services. Each Apps Script runs under the teacher's Google account.

## Files

- `index.html` — the complete FactFlow Check app
- `README.md` — this file
- `SETUP-GUIDE.md` — step-by-step teacher setup instructions
- `factflow-apps-script.gs` — Google Apps Script for the Sheet (copy-paste into your Sheet)
- `*.png` — app icons and logo
