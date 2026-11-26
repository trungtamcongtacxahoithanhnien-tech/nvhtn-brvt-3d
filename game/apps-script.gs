/**
 * BẢNG XẾP HẠNG – game "Hành trình Thành phố tôi yêu"
 * Dán toàn bộ file này vào Google Sheet → Tiện ích mở rộng → Apps Script, rồi Triển khai dạng Ứng dụng web
 * (Người truy cập: Bất kỳ ai). Xem HUONG-DAN.md.
 */
const SHEET_NAME = 'BangXepHang';
const HEADERS = ['Cập nhật lúc', 'Mã người chơi', 'Họ tên', 'Đơn vị/Lớp', 'Số điện thoại', 'Điểm', 'Số dấu ấn', 'Thời gian hoàn thành (phút)', 'Hoàn thành', 'Đã nhận quà'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const clean_ = (v, n) => String(v == null ? '' : v).replace(/^[=+\-@]/, "'").slice(0, n); // chặn công thức độc hại

// Người chơi gửi tiến độ (ghi mới hoặc cập nhật theo Mã người chơi)
function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = sheet_();
    const row = [new Date(), clean_(d.pid, 40), clean_(d.name, 60), clean_(d.unit, 80), clean_(d.phone, 20),
      Math.max(0, Math.min(5000, Number(d.score) || 0)), Math.max(0, Math.min(20, Number(d.count) || 0)),
      d.minutes === '' ? '' : Number(d.minutes) || '', d.finished ? 'Có' : '', d.redeemed ? 'Có' : ''];
    const ids = sh.getRange(2, 2, Math.max(1, sh.getLastRow() - 1), 1).getValues().map(r => r[0]);
    const i = ids.indexOf(row[1]);
    if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}

// Trò chơi lấy top 20 (không trả về số điện thoại)
function doGet(e) {
  if ((e.parameter.action || '') !== 'top') return json_({ ok: true });
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return json_({ rows: [] });
  const rows = sh.getRange(2, 1, n, HEADERS.length).getValues()
    .map(r => ({ pid: r[1], name: r[2], unit: r[3], score: Number(r[5]) || 0, count: Number(r[6]) || 0, minutes: r[7] === '' ? null : Number(r[7]) }))
    .sort((a, b) => b.score - a.score || (a.minutes ?? 1e9) - (b.minutes ?? 1e9))
    .slice(0, 20);
  return json_({ rows });
}
