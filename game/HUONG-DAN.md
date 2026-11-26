# Hướng dẫn tổ chức game "Hành trình Thành phố tôi yêu"

Link chơi: https://trungtamcongtacxahoithanhnien-tech.github.io/nvhtn-brvt-3d/game/
Trang in mã QR: https://trungtamcongtacxahoithanhnien-tech.github.io/nvhtn-brvt-3d/game/qr.html
Chế độ thử (chạm bản đồ để giả lập vị trí, dùng khi kiểm tra tại bàn): thêm `#test` vào cuối link chơi.

## 1. Trước sự kiện
1. **Đổi mã PIN nhân viên**: mở `game/data.js`, sửa `STAFF_PIN: '2026'` thành mã riêng. Mã này nằm trong mã nguồn công khai, nên chỉ dùng để chống bấm nhầm, không phải bảo mật cao — đổi mã cho từng sự kiện.
2. **In 9 mã QR** từ trang in, dán đúng vị trí ghi trên thẻ (sảnh chính, cổng, mép sân bóng rổ, mái che xe, tầng trệt, khu ẩm thực, dãy xe đẩy, bãi đất trống phía Đông, sân sau).
3. **Đi thử một vòng** bằng điện thoại thật: GPS ngoài trời thường sai 5–10 m; điểm dưới mái (tầng trệt, mái che xe) nên ưu tiên quét QR.

## 2. Bật bảng xếp hạng online (Google Sheet) — khoảng 5 phút
1. Tạo một Google Sheet mới (ví dụ "BXH Hành trình Thành phố tôi yêu").
2. Vào **Tiện ích mở rộng → Apps Script**, xóa hết nội dung có sẵn, dán toàn bộ file `game/apps-script.gs`, bấm 💾 Lưu.
3. Bấm **Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web**.
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
4. Bấm Triển khai, cấp quyền khi Google hỏi, rồi **sao chép URL Ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).
5. Mở `game/data.js`, dán URL vào `SHEET_API: '…'`, lưu và đưa lên GitHub.

Sheet sẽ có tab `BangXepHang` với: họ tên, đơn vị, số điện thoại (chỉ ban tổ chức thấy), điểm, số dấu ấn, thời gian hoàn thành, đã nhận quà. Bảng xếp hạng trong game chỉ hiện tên, đơn vị, điểm.

## 3. Luật chơi
- 9 dấu ấn, 3 độ hiếm: Thường 100 điểm, Hiếm 200 điểm, Huyền thoại 300 điểm; trả lời đúng ngay lần đầu +50 điểm. Tối đa 2.050 điểm.
- Đến trong phạm vi ~15 m của điểm (hoặc quét QR tại điểm) → dấu ấn xuất hiện trên camera → trả lời câu hỏi để thu thập. Trả lời sai phải chờ 10 giây.
- Thu thập đủ 9 dấu ấn → màn hình đổi quà có **mã 6 ký tự** và **đồng hồ chạy** (để nhận biết ảnh chụp màn hình). Nhân viên nhập PIN trên máy người chơi → hiện dấu "ĐÃ NHẬN QUÀ", mỗi máy chỉ nhận một lần.
- Xếp hạng: điểm cao hơn đứng trên; bằng điểm thì ai hoàn thành nhanh hơn đứng trên.

## 4. Lưu ý
- Tiến độ lưu trên trình duyệt của người chơi; xóa dữ liệu trình duyệt sẽ mất tiến độ.
- Một người có thể chơi lại bằng trình duyệt khác — đối chiếu số điện thoại trong Sheet khi trao giải lớn.
- Toạ độ các điểm đo từ ảnh vệ tinh Google Maps; có thể lệch vài mét so với GPS thực tế.
