// FactFlow Check Beta — Google Sheets Receiver
// Copy this entire file into Extensions → Apps Script in your Google Sheet.
// Then click Deploy → New Deployment → Web App:
//   - Execute as: Me
//   - Who has access: Anyone
//   - Copy the URL into the SUBMIT_URL constant in the HTML file.
//
// IMPORTANT: After pasting this code, create a NEW deployment (not just save).
//   Deploy → New Deployment → Web App → Deploy.
//   If you edit the script later, you must deploy again for changes to take effect.

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').split(' ').map(function (w) {
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

function doPost(e) {
  try {
    // Accept JSON from fetch (application/json) or form POST (url-encoded)
    var raw = '';
    if (e.postData && e.postData.contents) {
      raw = e.postData.contents;
    } else if (e.parameter && e.parameter.json) {
      raw = e.parameter.json;
    } else {
      return json({ ok: false, error: 'No data received. postData: ' + !!e.postData + ', param.json: ' + !!(e.parameter && e.parameter.json) });
    }
    var data = JSON.parse(raw);
    var studentName = normalizeName(data.studentName) || 'Unknown';

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Ensure Raw Data sheet exists
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

    // Ensure Summary sheet exists
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
      summary.getRange(foundRow + 1, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      summary.appendRow(rowValues);
    }

    // 3. Sort summary A-Z by student name
    var lastRow = summary.getLastRow();
    if (lastRow > 1) {
      var range = summary.getRange(2, 1, lastRow - 1, summary.getLastColumn());
      range.sort({ column: 1, ascending: true });
      summary.getRange(2, 2, lastRow - 1, 1).setNumberFormat('yyyy-MM-dd HH:mm');
    }

    return json({ ok: true, student: studentName });
  } catch (err) {
    return json({ ok: false, error: err.message || String(err) });
  }
}

function doGet() {
  return json({ ok: true, status: 'FactFlow Check Beta receiver is online.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
