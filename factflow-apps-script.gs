// FactFlow Check Beta — Google Sheets Receiver
// Copy this entire file into Extensions → Apps Script in your Google Sheet.
// Then click Deploy → New Deployment → Web App:
//   - Execute as: Me
//   - Who has access: Anyone
//   - Copy the URL into FactFlow Check Beta's "Submit URL" field.

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').split(' ').map(function (w) {
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Normalize the student name
  var studentName = normalizeName(data.studentName) || 'Unknown';

  // Ensure sheets exist
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var raw = ss.getSheetByName('Raw Data');
  if (!raw) {
    raw = ss.insertSheet('Raw Data');
    raw.appendRow([
      'Timestamp', 'Student', 'Code', 'Assessment',
      'Verified', 'Developing', 'Accuracy %', 'Fluent',
      'Slow', 'Wrong', 'Timeout', 'Questions',
      'Missed Facts', 'Restarted', 'Duration sec'
    ]);
    raw.hideSheet();
  }

  var summary = ss.getSheetByName('Summary');
  if (!summary) {
    summary = ss.insertSheet('Summary');
    summary.appendRow([
      'Student', 'Date', 'Code', 'Verified', 'Developing',
      'Accuracy %', 'Fluent', 'Slow', 'Missed', 'Facts to Review', 'Restart?'
    ]);
  }

  // 1. Append to Raw Data
  raw.appendRow([
    data.completedAt ? new Date(data.completedAt) : new Date(),
    studentName,
    data.code || '',
    data.assessmentName || '',
    data.verifiedBand || '',
    data.developingBand || '',
    data.accuracy != null ? data.accuracy : '',
    data.fluent != null ? data.fluent : '',
    data.slow != null ? data.slow : '',
    data.wrong != null ? data.wrong : '',
    data.timeout != null ? data.timeout : '',
    data.totalQuestions != null ? data.totalQuestions : '',
    (data.missedFacts || []).join(', '),
    data.restarted ? 'Yes (' + (data.restartCount || 0) + ')' : 'No',
    data.durationSec != null ? data.durationSec : ''
  ]);

  // 2. Update Summary — one row per student, latest only, A-Z
  var summaryData = summary.getDataRange().getValues();
  var foundRow = -1;

  // Find existing row for this student (skip header row)
  for (var i = 1; i < summaryData.length; i++) {
    if (normalizeName(summaryData[i][0]) === studentName) {
      foundRow = i;
      break;
    }
  }

  var rowValues = [
    studentName,
    data.completedAt ? new Date(data.completedAt) : new Date(),
    data.code || '',
    data.verifiedBand || '',
    data.developingBand || '',
    data.accuracy != null ? data.accuracy + '%' : '',
    data.fluent != null ? data.fluent : '',
    data.slow != null ? data.slow : '',
    (data.wrong || 0) + (data.timeout || 0),
    (data.missedFacts || []).join(', '),
    data.restarted ? 'Yes' : 'No'
  ];

  if (foundRow >= 0) {
    // Update existing row
    summary.getRange(foundRow + 1, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    // Append new row
    summary.appendRow(rowValues);
  }

  // 3. Sort summary A-Z by student name
  var lastRow = summary.getLastRow();
  if (lastRow > 1) {
    var range = summary.getRange(2, 1, lastRow - 1, summary.getLastColumn());
    range.sort({ column: 1, ascending: true });
  }

  // Format date columns in Summary
  if (lastRow > 1) {
    summary.getRange(2, 2, lastRow - 1, 1).setNumberFormat('yyyy-MM-dd HH:mm');
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('FactFlow Check Beta receiver is online.')
    .setMimeType(ContentService.MimeType.TEXT);
}
