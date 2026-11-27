// =====================================================================
//  GAME "HÀNH TRÌNH THÀNH PHỐ TÔI YÊU" – Nhà Văn hóa Thanh niên Bà Rịa – Vũng Tàu
//  Cấu hình + dữ liệu 9 dấu ấn. Ban tổ chức chỉ cần sửa phần CẤU HÌNH bên dưới.
// =====================================================================

export const CONFIG = {
  EVENT_NAME: 'Hành trình Thành phố tôi yêu',
  // Link Web App Google Apps Script (xem HUONG-DAN.md). Để trống = chưa có bảng xếp hạng online.
  SHEET_API: 'https://script.google.com/macros/s/AKfycbzncoCLQNZ9HF0nvaN1lIW-H--y-ehgOf21g7dD9YL7vFNB7oIss-xnMR-wgusTffN6Ag/exec',
  STAFF_PIN: '2026',        // mã PIN nhân viên dùng để xác nhận đổi quà — NHỚ ĐỔI trước sự kiện
  REWARD_MIN: 9,            // số dấu ấn cần thu thập để được đổi quà
  CATCH_RADIUS: 15,         // bán kính (m) để "bắt" dấu ấn bằng GPS
  GAME_URL: 'https://trungtamcongtacxahoithanhnien-tech.github.io/nvhtn-brvt-3d/game/',
};

// Gốc toạ độ: trung điểm chân mặt tiền khối nhà chính (đo trên ảnh vệ tinh Google Maps).
// Trục x ≈ hướng 248° (Tây Tây Nam), trục z ≈ hướng 338° (Bắc Tây Bắc, phía đường Hạ Long). Đơn vị mét.
export const GEO = { lat: 10.3410716, lon: 107.0747267, axAz: 248, azAz: 338 };

const MLAT = 110574, MLON = 111320 * Math.cos(GEO.lat * Math.PI / 180);
const dir = az => [Math.sin(az * Math.PI / 180), Math.cos(az * Math.PI / 180)]; // [Đông, Bắc]
const UX = dir(GEO.axAz), UZ = dir(GEO.azAz);
export function latLonToXZ(lat, lon) {
  const e = (lon - GEO.lon) * MLON, n = (lat - GEO.lat) * MLAT;
  return { x: e * UX[0] + n * UX[1], z: e * UZ[0] + n * UZ[1] };
}
export function xzToLatLon(x, z) {
  const e = x * UX[0] + z * UZ[0], n = x * UX[1] + z * UZ[1];
  return { lat: GEO.lat + n / MLAT, lon: GEO.lon + e / MLON };
}

export const RARITY = {
  common: { name: 'Thường', color: '#2f9e6e', pts: 100 },
  rare: { name: 'Hiếm', color: '#7a4fd6', pts: 200 },
  legend: { name: 'Huyền thoại', color: '#e0a100', pts: 300 },
};

// 9 dấu ấn: vị trí trong khuôn viên (x, z), mã QR dự phòng, câu hỏi (đáp án đúng luôn là a[0], trò chơi sẽ xáo trộn)
export const CHECKPOINTS = [
  { id: 1, key: 'q7m2', icon: 'nvhtn', rarity: 'common', name: 'Nhà Văn hóa Thanh niên', region: 'Vũng Tàu',
    spot: 'Sảnh chính (bậc tam cấp)', x: -7, z: 8,
    fact: 'Ngôi nhà chung của tuổi trẻ, nơi bắt đầu hành trình khám phá Thành phố mới.',
    q: 'TP.HCM mới (hợp nhất TP.HCM, Bình Dương và Bà Rịa – Vũng Tàu) chính thức hoạt động từ ngày nào?',
    a: ['1/7/2025', '30/4/2025', '2/9/2025'] },
  { id: 2, key: 'b4n8', icon: 'benthanh', rarity: 'common', name: 'Chợ Bến Thành', region: 'Sài Gòn',
    spot: 'Cổng chính (đường Hạ Long)', x: -5, z: 34,
    fact: 'Ngôi chợ biểu tượng của Sài Gòn với cổng chính có tháp đồng hồ.',
    q: 'Công trình nổi bật ở cổng chính chợ Bến Thành là gì?',
    a: ['Tháp đồng hồ', 'Tháp chuông', 'Cột cờ'] },
  { id: 3, key: 'd9x3', icon: 'dinh', rarity: 'rare', name: 'Dinh Độc Lập', region: 'Sài Gòn',
    spot: 'Mép sân bóng rổ phía Tây', x: 8, z: 22,
    fact: 'Nơi chứng kiến khoảnh khắc thống nhất đất nước trưa 30/4/1975.',
    q: 'Xe tăng quân giải phóng tiến vào Dinh Độc Lập vào ngày nào?',
    a: ['30/4/1975', '2/9/1945', '19/5/1975'] },
  { id: 4, key: 'r5k1', icon: 'nharong', rarity: 'legend', name: 'Bến Nhà Rồng', region: 'Sài Gòn',
    spot: 'Mái che giữ xe', x: 21, z: 2,
    fact: 'Năm 1911, người thanh niên Nguyễn Tất Thành rời bến cảng này ra đi tìm đường cứu nước.',
    q: 'Năm 1911, từ Bến Nhà Rồng, người thanh niên Nguyễn Tất Thành đã…',
    a: ['Ra đi tìm đường cứu nước', 'Đọc bản Tuyên ngôn Độc lập', 'Thành lập Đoàn Thanh niên'] },
  { id: 5, key: 'c2t6', icon: 'cuchi', rarity: 'rare', name: 'Địa đạo Củ Chi', region: 'Sài Gòn',
    spot: 'Tầng trệt để trống (dưới khối mái ngũ giác)', x: -45, z: 0,
    fact: '“Làng ngầm” huyền thoại với hệ thống đường hầm nhiều tầng dưới lòng đất.',
    q: 'Hệ thống địa đạo Củ Chi dài khoảng bao nhiêu?',
    a: ['Khoảng 250 km', 'Khoảng 25 km', 'Khoảng 2.500 km'] },
  { id: 6, key: 'h8p4', icon: 'haidang', rarity: 'rare', name: 'Hải đăng Vũng Tàu', region: 'Vũng Tàu',
    spot: 'Khu ẩm thực “Bến đỗ Thanh niên”', x: -40, z: 26,
    fact: 'Ngọn hải đăng soi đường cho tàu thuyền ra vào cửa biển Vũng Tàu.',
    q: 'Hải đăng Vũng Tàu nằm trên ngọn núi nào?',
    a: ['Núi Nhỏ', 'Núi Lớn', 'Núi Dinh'] },
  { id: 7, key: 'w3v9', icon: 'bachdinh', rarity: 'common', name: 'Bạch Dinh', region: 'Vũng Tàu',
    spot: 'Dãy xe đẩy dưới tán cây', x: -68, z: 33,
    fact: 'Biệt thự trắng mái ngói đỏ (Villa Blanche) nhìn ra biển Vũng Tàu.',
    q: 'Bạch Dinh (Villa Blanche) nằm ở đâu?',
    a: ['Sườn Núi Lớn, Vũng Tàu', 'Đỉnh Núi Nhỏ, Vũng Tàu', 'Đặc khu Côn Đảo'] },
  { id: 8, key: 'k6z5', icon: 'condao', rarity: 'legend', name: 'Côn Đảo', region: 'Đặc khu Côn Đảo',
    spot: 'Bãi đất trống phía Đông', x: -82, z: 0,
    fact: 'Vùng đất thiêng, nơi an nghỉ của nhiều anh hùng, liệt sĩ.',
    q: 'Nữ anh hùng Võ Thị Sáu yên nghỉ tại nghĩa trang nào ở Côn Đảo?',
    a: ['Nghĩa trang Hàng Dương', 'Nghĩa trang Trường Sơn', 'Nghĩa trang Đường 9'] },
  { id: 9, key: 's1m7', icon: 'sonmai', rarity: 'common', name: 'Sơn mài Tương Bình Hiệp', region: 'Bình Dương',
    spot: 'Sân sau (gần dãy nhà 2 tầng)', x: -45, z: -25,
    fact: 'Làng nghề sơn mài truyền thống hàng trăm năm của vùng đất Bình Dương.',
    q: 'Làng nghề Tương Bình Hiệp (Bình Dương cũ) nổi tiếng với nghề gì?',
    a: ['Sơn mài', 'Gốm sứ', 'Dệt thổ cẩm'] },
];

// ---------- Hình minh họa dấu ấn (SVG tự vẽ) ----------
export const ICONS = {
  nvhtn: `<rect x="18" y="44" width="56" height="52" rx="2" fill="#e9e5dc"/><rect x="26" y="52" width="34" height="38" fill="#1f8f8a"/>
    <path d="M26 64h34M26 76h34M37 52v38M49 52v38" stroke="#0e5f5b" stroke-width="1.5"/><circle cx="88" cy="70" r="18" fill="#f4f1ea"/>
    <ellipse cx="88" cy="53" rx="20" ry="5" fill="#cfc9bc"/><rect x="62" y="22" width="2" height="24" fill="#777"/><path d="M64 23h16l-4 5 4 5H64z" fill="#d2232a"/>
    <path d="M10 96h100" stroke="#8a8270" stroke-width="3"/>`,
  benthanh: `<rect x="14" y="58" width="92" height="38" fill="#e8c27a"/><path d="M14 58l46-14 46 14z" fill="#c98a3a"/>
    <rect x="48" y="24" width="24" height="72" fill="#f2d79c"/><path d="M46 24h28l-14-12z" fill="#b5651d"/><circle cx="60" cy="40" r="8" fill="#fff" stroke="#6b4f3a" stroke-width="2"/>
    <path d="M60 35v5l3 2" stroke="#333" stroke-width="1.5" fill="none"/><path d="M52 96v-18a8 8 0 0 1 16 0v18z" fill="#7a5230"/>
    <rect x="22" y="68" width="16" height="12" fill="#9a6b3a"/><rect x="82" y="68" width="16" height="12" fill="#9a6b3a"/>`,
  dinh: `<rect x="10" y="70" width="100" height="26" fill="#f1efe8"/><rect x="18" y="52" width="84" height="20" fill="#e6e2d6"/>
    <path d="M18 56h84M18 62h84M18 68h84" stroke="#b9b29f"/><rect x="40" y="40" width="40" height="12" fill="#f6f4ee"/>
    <rect x="59" y="14" width="2" height="26" fill="#777"/><path d="M61 15h18v12H61z" fill="#d2232a"/><path d="M68 19l1.3 2.6 2.8.2-2.2 1.8.8 2.8-2.7-1.6-2.6 1.6.7-2.8-2.1-1.8 2.8-.2z" fill="#ffd400"/>
    <path d="M30 96v-20M45 96v-20M60 96v-20M75 96v-20M90 96v-20" stroke="#cfc9bc" stroke-width="3"/>`,
  nharong: `<path d="M6 92q10-6 20 0t20 0 20 0 20 0 20 0 20 0" stroke="#2a7fd0" stroke-width="4" fill="none"/>
    <rect x="24" y="54" width="72" height="32" fill="#f3e6c8"/><path d="M18 56l42-16 42 16z" fill="#b5463a"/>
    <path d="M24 44q6-12 14-6M96 44q-6-12-14-6" stroke="#2f9e6e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="34" y="62" width="10" height="12" fill="#7a5230"/><rect x="55" y="62" width="10" height="24" fill="#7a5230"/><rect x="76" y="62" width="10" height="12" fill="#7a5230"/>
    <path d="M56 30h10v-14h-10z" fill="#d2232a"/><rect x="55" y="16" width="1.6" height="26" fill="#666"/>`,
  cuchi: `<rect x="6" y="40" width="108" height="58" fill="#8a5a33"/><path d="M6 40h108" stroke="#3f7a35" stroke-width="6"/>
    <path d="M22 40v16h30v18h40v-12" stroke="#3a2412" stroke-width="9" fill="none" stroke-linejoin="round"/>
    <rect x="16" y="32" width="14" height="6" fill="#6b4f3a"/><path d="M40 34q6-14 12 0M70 34q6-16 12 0M92 36q4-10 8 0" fill="#3f7a35"/>
    <circle cx="30" cy="84" r="3" fill="#e0a100"/>`,
  haidang: `<path d="M8 96q30-40 52-44t52 44z" fill="#4c8a3f"/><path d="M52 52l4-34h8l4 34z" fill="#fff"/>
    <path d="M53 44h14M54 34h12" stroke="#d2232a" stroke-width="5"/><rect x="54" y="12" width="12" height="8" fill="#ffd400"/>
    <path d="M60 10v-4M66 16l20-8M54 16l-20-8" stroke="#ffd400" stroke-width="3" stroke-linecap="round"/><path d="M50 18h20" stroke="#555" stroke-width="2"/>`,
  bachdinh: `<path d="M4 96q36-34 70-30t42 30z" fill="#5c9a3e"/><rect x="32" y="50" width="56" height="30" fill="#fbfaf6"/>
    <path d="M28 52l32-18 32 18z" fill="#c0392b"/><rect x="38" y="58" width="8" height="10" fill="#9ec9e6"/><rect x="56" y="58" width="8" height="10" fill="#9ec9e6"/>
    <rect x="74" y="58" width="8" height="10" fill="#9ec9e6"/><path d="M14 80l6-20 6 20zM98 82l5-16 5 16z" fill="#3f7a35"/><path d="M0 100q60-6 120 0" stroke="#2a7fd0" stroke-width="6"/>`,
  condao: `<rect x="0" y="62" width="120" height="40" fill="#3a8fd0"/><path d="M14 64q20-30 46-26t40 26z" fill="#4c8a3f"/>
    <ellipse cx="74" cy="86" rx="18" ry="11" fill="#5b7f3a"/><path d="M62 82h24M66 78l4 16M78 78l-4 16" stroke="#3d5a26" stroke-width="2"/>
    <circle cx="94" cy="84" r="5" fill="#5b7f3a"/><path d="M60 80l-8-6M60 92l-8 6M88 92l6 6" stroke="#5b7f3a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="96" cy="22" r="10" fill="#ffd400"/>`,
  sonmai: `<path d="M44 20h32l-4 10q22 14 18 40t-26 30h-8q-22-4-26-30t18-40z" fill="#1d1b1b"/>
    <path d="M38 56q22 10 44 0" stroke="#e0a100" stroke-width="3" fill="none"/><path d="M40 70q20 8 40 0" stroke="#c0392b" stroke-width="5" fill="none"/>
    <circle cx="60" cy="44" r="6" fill="#e0a100"/><path d="M54 44h12M60 38v12" stroke="#1d1b1b" stroke-width="1.5"/><rect x="40" y="98" width="40" height="4" rx="2" fill="#7a5230"/>`,
};

// ---------- Ảnh thật (Wikimedia Commons, giấy phép tự do — ghi nguồn bắt buộc) ----------
export const PHOTOS = {
  nvhtn: { src: 'img/nvhtn.jpg', by: 'Trung tâm CTXH Thanh niên', lic: 'Ảnh tự chụp', page: null },
  benthanh: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Ben_Thanh_market_2.jpg/500px-Ben_Thanh_market_2.jpg', by: 'Riza', lic: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Ben_Thanh_market_2.jpg' },
  dinh: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Dinh_%C4%90%E1%BB%99c_L%E1%BA%ADp_02.JPG/500px-Dinh_%C4%90%E1%BB%99c_L%E1%BA%ADp_02.JPG', by: 'TDA (Wikipedia tiếng Việt)', lic: 'Phạm vi công cộng', page: 'https://commons.wikimedia.org/wiki/File:Dinh_%C4%90%E1%BB%99c_L%E1%BA%ADp_02.JPG' },
  nharong: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Ben_Nha_Rong_2.JPG/500px-Ben_Nha_Rong_2.JPG', by: 'Eternal Dragon', lic: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Ben_Nha_Rong_2.JPG' },
  cuchi: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/25/Entrance_Cu_Chi_Tunnel_Vietnam_%2825673144018%29.jpg/500px-Entrance_Cu_Chi_Tunnel_Vietnam_%2825673144018%29.jpg', by: 'dronepicr', lic: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Entrance_Cu_Chi_Tunnel_Vietnam_(25673144018).jpg' },
  haidang: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/H%E1%BA%A3i_%C4%91%C4%83ng_V%C5%A9ng_T%C3%A0u.JPG/500px-H%E1%BA%A3i_%C4%91%C4%83ng_V%C5%A9ng_T%C3%A0u.JPG', by: 'Hoangvantoanajc', lic: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:H%E1%BA%A3i_%C4%91%C4%83ng_V%C5%A9ng_T%C3%A0u.JPG' },
  bachdinh: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/White_Palace_Vung_Tau_from_Flycam.jpg/500px-White_Palace_Vung_Tau_from_Flycam.jpg', by: 'Khanhngujen', lic: 'Phạm vi công cộng', page: 'https://commons.wikimedia.org/wiki/File:White_Palace_Vung_Tau_from_Flycam.jpg' },
  condao: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/C%C3%B4n_%C4%90%E1%BA%A3o%2C_B%C3%A0_R%E1%BB%8Ba_-_V%C5%A9ng_T%C3%A0u%2C_Vietnam_-_panoramio_%2810%29.jpg/500px-C%C3%B4n_%C4%90%E1%BA%A3o%2C_B%C3%A0_R%E1%BB%8Ba_-_V%C5%A9ng_T%C3%A0u%2C_Vietnam_-_panoramio_%2810%29.jpg', by: 'Lam Tr Th', lic: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:C%C3%B4n_%C4%90%E1%BA%A3o,_B%C3%A0_R%E1%BB%8Ba_-_V%C5%A9ng_T%C3%A0u,_Vietnam_-_panoramio_(10).jpg' },
  sonmai: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Lacquered_box_-_Vietnam_National_Museum_of_Fine_Arts_-_Hanoi%2C_Vietnam_-_DSC05246.JPG/500px-Lacquered_box_-_Vietnam_National_Museum_of_Fine_Arts_-_Hanoi%2C_Vietnam_-_DSC05246.JPG', by: 'Daderot', lic: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Lacquered_box_-_Vietnam_National_Museum_of_Fine_Arts_-_Hanoi,_Vietnam_-_DSC05246.JPG', note: 'Ảnh minh họa đồ sơn mài Việt Nam' },
};

// ---- Địa danh thêm cho BẢN DEMO (game thật vẫn dùng 9 điểm ở trên) ----
export const DEMO_EXTRA = [
  { id: 10, key: 'dm10', icon: 'ducba', rarity: 'rare', name: 'Nhà thờ Đức Bà', region: 'Sài Gòn',
    fact: 'Xây dựng 1877–1880, toàn bộ gạch đỏ ốp ngoài được chở từ Marseille (Pháp) sang và đến nay vẫn giữ màu hồng tươi.',
    q: 'Gạch đỏ ốp ngoài Nhà thờ Đức Bà Sài Gòn được chở từ đâu sang?',
    a: ['Marseille (Pháp)', 'Hà Nội', 'Nhật Bản', 'Ý'] },
  { id: 11, key: 'dm11', icon: 'buudien', rarity: 'common', name: 'Bưu điện Thành phố', region: 'Sài Gòn',
    fact: 'Bưu điện Trung tâm Sài Gòn xây dựng 1886–1891, mái vòm sắt kính rộng lớn, đến nay vẫn nhận gửi thư và bưu thiếp.',
    q: 'Bưu điện Trung tâm Sài Gòn được xây dựng xong vào năm nào?',
    a: ['1891', '1945', '1975', '1920'] },
  { id: 12, key: 'dm12', icon: 'nhahat', rarity: 'common', name: 'Nhà hát Thành phố', region: 'Sài Gòn',
    fact: 'Nhà hát Thành phố hoàn thành năm 1900, mang phong cách kiến trúc Pháp, nằm đầu đường Đồng Khởi.',
    q: 'Nhà hát Thành phố (Sài Gòn) được hoàn thành vào năm nào?',
    a: ['1900', '1930', '1960', '1880'] },
  { id: 13, key: 'dm13', icon: 'nguyenhue', rarity: 'common', name: 'Phố đi bộ Nguyễn Huệ', region: 'Sài Gòn',
    fact: 'Phố đi bộ đầu tiên của Thành phố, khai trương dịp 30/4/2015, nổi tiếng với đường hoa Tết mỗi năm.',
    q: 'Phố đi bộ Nguyễn Huệ chính thức khai trương vào năm nào?',
    a: ['2015', '2005', '2020', '1998'] },
  { id: 14, key: 'dm14', icon: 'landmark', rarity: 'legend', name: 'Landmark 81', region: 'Sài Gòn',
    fact: 'Toà nhà cao nhất Việt Nam (khoảng 461 m), hoàn thành năm 2018, hình dáng lấy cảm hứng từ bó tre.',
    q: 'Landmark 81 cao khoảng bao nhiêu mét?',
    a: ['461 m', '272 m', '350 m', '600 m'] },
  { id: 15, key: 'dm15', icon: 'thuthiem', rarity: 'rare', name: 'Cầu Thủ Thiêm 2', region: 'Sài Gòn',
    fact: 'Cầu dây văng thông xe năm 2022, nối trung tâm Quận 1 cũ với khu đô thị mới Thủ Thiêm.',
    q: 'Cầu Thủ Thiêm 2 bắc qua con sông nào?',
    a: ['Sông Sài Gòn', 'Sông Đồng Nai', 'Sông Vàm Cỏ Đông', 'Sông Tiền'] },
  { id: 16, key: 'dm16', icon: 'nuinho', rarity: 'rare', name: 'Núi Nhỏ', region: 'Vũng Tàu',
    fact: 'Núi Nhỏ (Núi Tao Phùng) nằm sát biển Vũng Tàu, trên núi có ngọn hải đăng cổ và nhiều lối đi bộ ngắm biển.',
    q: 'Ngọn hải đăng Vũng Tàu nằm trên ngọn núi nào?',
    a: ['Núi Nhỏ', 'Núi Lớn', 'Núi Bà Đen', 'Núi Sam'] },
];
