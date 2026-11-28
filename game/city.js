// =====================================================================
//  CHẾ ĐỘ "TOÀN THÀNH PHỐ" (chỉ dùng cho BẢN DEMO)
//  Rải linh vật khắp TP. Hồ Chí Minh (sau hợp nhất: TP.HCM – Bình Dương –
//  Bà Rịa Vũng Tàu – đặc khu Côn Đảo), tập trung dày tại các địa điểm trong
//  lịch trình "Gặp mặt và tôn vinh thanh niên làm sáng tạo nội dung số 2026".
//  Mỗi linh vật được nhân bản nhiều lần, mỗi bản là một dấu ấn riêng.
//
//  Mở bằng: game/?demo=city
//  Tham số: &d=1.5 (dày hơn 1,5 lần)  &r=25 (bán kính bắt, m)
// =====================================================================

// Tâm hệ toạ độ của chế độ thành phố: Trụ sở UBND TP (86 Lê Thánh Tôn).
export const CITY_ORIGIN = { lat: 10.7765867, lon: 106.7009177 };

const HUONG8 = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];

// ---------------------------------------------------------------------
//  DANH SÁCH ĐỊA ĐIỂM
//  k   : mã vùng            nm : tên hiển thị
//  lat/lon : toạ độ (Google Maps / OpenStreetMap, tra ngày 28/11/2026)
//  r   : bán kính rải (m)   n  : số linh vật tại vùng
//  ic  : các linh vật ưu tiên xuất hiện ở vùng (phần tử đầu nhiều nhất)
//  grp : nhóm, hiện trong sổ tay
// ---------------------------------------------------------------------

// ---- (1) CÁC ĐIỂM TRONG LỊCH TRÌNH KOL 2026 — rải dày ----
const LICH_TRINH = [
  // Lưu trú & lễ tuyên dương
  { k: 't78', nm: 'Nhà khách T78', lat: 10.7848363, lon: 106.6848255, r: 70, n: 8, ic: ['nvhtn', 'dinh'], grp: 'Lưu trú & Lễ tuyên dương' },
  { k: 'hoasen', nm: 'ĐH Hoa Sen – cơ sở Thành Thái', lat: 10.7696874, lon: 106.6651139, r: 90, n: 12, ic: ['nvhtn', 'landmark', 'nguyenhue'], grp: 'Lưu trú & Lễ tuyên dương' },

  // Tuyến 1 – "Kỷ nguyên vươn mình"
  { k: 'gihub', nm: 'Galaxy Innovation Hub – Khu Công nghệ cao', lat: 10.8529159, lon: 106.7961967, r: 120, n: 10, ic: ['landmark', 'thuthiem'], grp: 'Tuyến 1 · Kỷ nguyên vươn mình' },
  { k: 'gacnc', nm: 'Ga Metro Khu Công nghệ cao', lat: 10.8589881, lon: 106.7888345, r: 90, n: 7, ic: ['landmark', 'thuthiem'], grp: 'Tuyến 1 · Kỷ nguyên vươn mình' },
  { k: 'nhahat', nm: 'Nhà hát Thành phố (ga Metro số 1)', lat: 10.7767437, lon: 106.7032488, r: 70, n: 10, ic: ['nhahat', 'nguyenhue'], grp: 'Tuyến 1 · Kỷ nguyên vươn mình' },
  { k: 'nguyenhue', nm: 'Phố đi bộ Nguyễn Huệ', lat: 10.7737196, lon: 106.7040457, r: 150, n: 12, ic: ['nguyenhue', 'nhahat', 'landmark'], grp: 'Tuyến 1 · Kỷ nguyên vươn mình' },
  { k: 'ubnd', nm: 'Trụ sở UBND Thành phố', lat: 10.7765867, lon: 106.7009177, r: 70, n: 8, ic: ['dinh', 'nguyenhue'], grp: 'Tuyến 1 · Kỷ nguyên vươn mình' },

  // Tuyến 2 – "Thành phố anh hùng"
  { k: 'chungtich', nm: 'Bảo tàng Chứng tích chiến tranh', lat: 10.7793647, lon: 106.6922806, r: 80, n: 10, ic: ['cuchi', 'condao', 'dinh'], grp: 'Tuyến 2 · Thành phố anh hùng' },
  { k: 'hamvukhi', nm: 'Hầm chứa vũ khí Biệt động Sài Gòn', lat: 10.7721658, lon: 106.6859349, r: 60, n: 8, ic: ['cuchi', 'condao'], grp: 'Tuyến 2 · Thành phố anh hùng' },

  // Tuyến 3 – "Dấu ấn di sản"
  { k: 'benthanh', nm: 'Chợ Bến Thành', lat: 10.7725301, lon: 106.6980365, r: 90, n: 12, ic: ['benthanh', 'nguyenhue'], grp: 'Tuyến 3 · Dấu ấn di sản' },
  { k: 'btlichsu', nm: 'Bảo tàng Lịch sử Thành phố', lat: 10.7879719, lon: 106.7049563, r: 80, n: 9, ic: ['sonmai', 'nharong', 'condao'], grp: 'Tuyến 3 · Dấu ấn di sản' },
  { k: 'thaocamvien', nm: 'Thảo Cầm Viên Sài Gòn', lat: 10.7878424, lon: 106.7063352, r: 180, n: 10, ic: ['condao', 'nuinho', 'cuchi'], grp: 'Tuyến 3 · Dấu ấn di sản' },

  // Buổi tối 28/11 – xe buýt 2 tầng
  { k: 'kimdo', nm: 'Khách sạn Kim Đô', lat: 10.774645, lon: 106.7025442, r: 60, n: 6, ic: ['nguyenhue', 'nhahat'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'bachdang', nm: 'Bến Bạch Đằng', lat: 10.7745000, lon: 106.7065000, r: 140, n: 10, ic: ['nharong', 'thuthiem', 'landmark'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'khanhhoi', nm: 'Cầu Khánh Hội', lat: 10.7690326, lon: 106.7056077, r: 90, n: 6, ic: ['nharong', 'thuthiem'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'bason', nm: 'Cầu Ba Son (Thủ Thiêm 2)', lat: 10.7804050, lon: 106.7085056, r: 160, n: 9, ic: ['thuthiem', 'landmark'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'ducba', nm: 'Nhà thờ Đức Bà', lat: 10.7797331, lon: 106.6990387, r: 70, n: 10, ic: ['ducba', 'buudien'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'buudien', nm: 'Bưu điện Thành phố', lat: 10.7799557, lon: 106.6999921, r: 60, n: 8, ic: ['buudien', 'ducba'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'dinh', nm: 'Dinh Độc Lập', lat: 10.7770348, lon: 106.6954880, r: 120, n: 10, ic: ['dinh', 'cuchi'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'conrua', nm: 'Hồ Con Rùa', lat: 10.7826109, lon: 106.6959330, r: 70, n: 7, ic: ['ducba', 'nvhtn'], grp: 'Tối 28/11 · Thành phố về đêm' },
  { k: 'giotnuoc', nm: 'Công viên Giọt nước (tưởng niệm COVID-19)', lat: 10.7799000, lon: 106.6723000, r: 90, n: 6, ic: ['condao', 'nvhtn'], grp: 'Tối 28/11 · Thành phố về đêm', uoc: true },

  // Sáng 29/11 – dâng hương, an sinh xã hội
  { k: 'thieunhi', nm: 'Nhà Thiếu nhi Thành phố', lat: 10.7839626, lon: 106.6888998, r: 80, n: 8, ic: ['nvhtn', 'nharong'], grp: 'Sáng 29/11 · Dâng hương & an sinh' },
  { k: 'lethirieng', nm: 'Công viên Lê Thị Riêng', lat: 10.7849107, lon: 106.6646223, r: 220, n: 12, ic: ['condao', 'cuchi', 'nvhtn'], grp: 'Sáng 29/11 · Dâng hương & an sinh' },
  { k: 'thinghe', nm: 'Trung tâm Dưỡng lão Thị Nghè', lat: 10.7963323, lon: 106.7102142, r: 70, n: 7, ic: ['nvhtn', 'bachdinh'], grp: 'Sáng 29/11 · Dâng hương & an sinh' },
  { k: 'govap', nm: 'TT Nuôi dưỡng Bảo trợ trẻ em Gò Vấp', lat: 10.8222145, lon: 106.6858960, r: 80, n: 7, ic: ['nvhtn', 'nuinho'], grp: 'Sáng 29/11 · Dâng hương & an sinh' },

  // Chiều 29/11 – phiên chuyên đề
  { k: 'nvhtnhcm', nm: 'Nhà Văn hóa Thanh niên TP.HCM', lat: 10.7814708, lon: 106.6967953, r: 90, n: 10, ic: ['nvhtn', 'ducba'], grp: 'Chiều 29/11 · Phiên chuyên đề' },
  { k: 'ueh', nm: 'ĐH Kinh tế TP.HCM (59C Nguyễn Đình Chiểu)', lat: 10.7830141, lon: 106.6948927, r: 80, n: 10, ic: ['nvhtn', 'landmark'], grp: 'Chiều 29/11 · Phiên chuyên đề' },
];

// ---- (2) ĐỊA DANH NỔI TIẾNG — rải vừa ----
const DIA_DANH = [
  { k: 'nharong', nm: 'Bến Nhà Rồng', lat: 10.7682855, lon: 106.7066447, r: 110, n: 7, ic: ['nharong'], grp: 'Địa danh Thành phố' },
  { k: 'landmark', nm: 'Landmark 81', lat: 10.7950845, lon: 106.7219139, r: 140, n: 7, ic: ['landmark'], grp: 'Địa danh Thành phố' },
  { k: 'taodan', nm: 'Công viên Tao Đàn', lat: 10.7745218, lon: 106.6928045, r: 200, n: 8, ic: ['dinh', 'nvhtn'], grp: 'Địa danh Thành phố' },
  { k: 'cuchi', nm: 'Địa đạo Củ Chi', lat: 11.0630436, lon: 106.5291244, r: 350, n: 8, ic: ['cuchi'], grp: 'Địa danh Thành phố' },
  { k: 'haidang', nm: 'Hải đăng Vũng Tàu – Núi Nhỏ', lat: 10.3390000, lon: 107.0830000, r: 200, n: 7, ic: ['haidang', 'nuinho'], grp: 'Địa danh Thành phố' },
  { k: 'bachdinh', nm: 'Bạch Dinh – Núi Lớn', lat: 10.3490000, lon: 107.0730000, r: 180, n: 6, ic: ['bachdinh'], grp: 'Địa danh Thành phố' },
  { k: 'sonmai', nm: 'Làng sơn mài Tương Bình Hiệp', lat: 10.9970000, lon: 106.6420000, r: 300, n: 6, ic: ['sonmai'], grp: 'Địa danh Thành phố' },
  { k: 'condao', nm: 'Côn Đảo – Nghĩa trang Hàng Dương', lat: 8.6930000, lon: 106.6220000, r: 400, n: 6, ic: ['condao'], grp: 'Địa danh Thành phố' },
];

// ---- (3) RẢI THƯA KHẮP THÀNH PHỐ ----
// Bán kính lớn, mật độ thấp — để bản đồ toàn cảnh phủ kín thành phố.
const KHAP_TP = [
  ['q3', 'Khu vực Võ Thị Sáu', 10.7840, 106.6860],
  ['q4', 'Khu vực Quận 4', 10.7590, 106.7030],
  ['cholon', 'Chợ Lớn', 10.7540, 106.6680],
  ['binhtay', 'Chợ Bình Tây', 10.7490, 106.6500],
  ['phumyhung', 'Phú Mỹ Hưng', 10.7290, 106.7190],
  ['q8', 'Khu vực Quận 8', 10.7240, 106.6280],
  ['q10', 'Khu vực Quận 10', 10.7730, 106.6670],
  ['damsen', 'Đầm Sen', 10.7670, 106.6390],
  ['q12', 'Khu vực Quận 12', 10.8650, 106.6540],
  ['thanhda', 'Thanh Đa – Bình Thạnh', 10.8080, 106.7110],
  ['govapkv', 'Khu vực Gò Vấp', 10.8380, 106.6660],
  ['phunhuan', 'Khu vực Phú Nhuận', 10.7990, 106.6800],
  ['tanbinh', 'Khu vực Tân Bình', 10.8180, 106.6580],
  ['tanphu', 'Khu vực Tân Phú', 10.7900, 106.6280],
  ['binhtan', 'Khu vực Bình Tân', 10.7650, 106.6030],
  ['linhtrung', 'Thủ Đức – Linh Trung', 10.8700, 106.7900],
  ['thuthiemkv', 'Khu đô thị Thủ Thiêm', 10.7820, 106.7260],
  ['nhabe', 'Nhà Bè', 10.6950, 106.7350],
  ['binhchanh', 'Bình Chánh', 10.6880, 106.5880],
  ['hocmon', 'Hóc Môn', 10.8860, 106.5940],
  ['cuchikv', 'Củ Chi', 10.9740, 106.4940],
  ['cangio', 'Cần Giờ', 10.4110, 106.9540],
  ['thudaumot', 'Thủ Dầu Một', 10.9800, 106.6520],
  ['dian', 'Dĩ An', 10.9060, 106.7690],
  ['thuanan', 'Thuận An', 10.9230, 106.7050],
  ['bencat', 'Bến Cát', 11.1500, 106.6000],
  ['baria', 'Bà Rịa', 10.5000, 107.1680],
  ['baisau', 'Bãi Sau – Vũng Tàu', 10.3460, 107.0900],
  ['phumy', 'Phú Mỹ', 10.5800, 107.0300],
].map(([k, nm, lat, lon]) => ({ k, nm, lat, lon, r: 1300, n: 4, grp: 'Khắp Thành phố' }));

export const CITY_SPOTS = [...LICH_TRINH, ...DIA_DANH, ...KHAP_TP];

// Linh vật hay gặp ở từng miền (dùng cho các vùng không khai báo `ic`)
const MIEN = {
  vungtau: ['haidang', 'bachdinh', 'nuinho', 'condao'],
  binhduong: ['sonmai', 'nvhtn', 'landmark'],
  saigon: ['benthanh', 'dinh', 'nharong', 'ducba', 'buudien', 'nhahat', 'nguyenhue', 'landmark', 'thuthiem', 'cuchi', 'nvhtn'],
};
const mienCua = (lat, lon) => (lat < 10.75 && lon > 106.9) || lat < 9 ? 'vungtau' : (lat > 10.95 ? 'binhduong' : 'saigon');

// ---------------------------------------------------------------------
//  SINH DẤU ẤN
// ---------------------------------------------------------------------
// Bộ sinh số ngẫu nhiên có hạt giống cố định: mọi máy đều ra cùng một bản đồ.
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const MLON = lat => 111320 * Math.cos(lat * Math.PI / 180);
const LEN = { common: 'rare', rare: 'legend', legend: 'legend' };

/**
 * Sinh danh sách dấu ấn cho chế độ thành phố.
 * @param {Array} base  CHECKPOINTS + DEMO_EXTRA (để lấy tên, câu hỏi, độ hiếm theo từng linh vật)
 * @param {number} mat  hệ số mật độ (1 = mặc định)
 */
export function buildCityCheckpoints(base, mat = 1) {
  // gốc dữ liệu cho từng linh vật
  const goc = {};
  for (const c of base) if (!goc[c.icon]) goc[c.icon] = c;
  const moiIcon = Object.keys(goc);

  const r = rng(20261128);
  const out = [];
  let id = 1000;

  for (const z of CITY_SPOTS) {
    const uu = (z.ic && z.ic.length ? z.ic : MIEN[mienCua(z.lat, z.lon)]).filter(i => goc[i]);
    const n = Math.max(1, Math.round(z.n * mat));
    for (let i = 0; i < n; i++) {
      // điểm ngẫu nhiên đều trong hình tròn bán kính z.r
      const goc_ = r() * 2 * Math.PI, d = z.r * Math.sqrt(r());
      const bac = d * Math.cos(goc_), dong = d * Math.sin(goc_);
      const lat = z.lat + bac / 110574, lon = z.lon + dong / MLON(z.lat);

      // chọn linh vật: 70% lấy trong nhóm ưu tiên (linh vật đầu nặng ký nhất), 30% ngẫu nhiên toàn bộ
      let icon;
      if (r() < 0.7 && uu.length) icon = r() < 0.55 ? uu[0] : uu[Math.floor(r() * uu.length)];
      else icon = moiIcon[Math.floor(r() * moiIcon.length)];
      const g = goc[icon];

      // 1/12 dấu ấn được nâng một bậc độ hiếm cho đỡ đều
      const rarity = r() < 1 / 12 ? LEN[g.rarity] : g.rarity;

      const az = (Math.atan2(dong, bac) * 180 / Math.PI + 360) % 360;
      const spot = d < 25 ? `${z.nm} (ngay tại điểm)` : `${z.nm} — ${HUONG8[Math.round(az / 45) % 8]}, cách ~${Math.round(d)} m`;

      out.push({
        id: ++id, key: 'c' + id.toString(36), icon, rarity,
        name: g.name, region: g.region, fact: g.fact, q: g.q, a: g.a,
        lat, lon, spot, zone: z.nm, zoneKey: z.k, grp: z.grp || 'Khắp Thành phố', uoc: !!z.uoc,
      });
    }
  }
  return out;
}

/** Gom dấu ấn theo vùng, dùng cho sổ tay. */
export function groupByZone(cps) {
  const m = new Map();
  for (const c of cps) {
    if (!m.has(c.grp)) m.set(c.grp, new Map());
    const g = m.get(c.grp);
    if (!g.has(c.zoneKey)) g.set(c.zoneKey, { nm: c.zone, list: [] });
    g.get(c.zoneKey).list.push(c);
  }
  return m;
}
