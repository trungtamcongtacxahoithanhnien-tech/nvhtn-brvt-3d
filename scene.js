// Mô hình 3D Nhà Văn hóa Thanh niên Bà Rịa – Vũng Tàu (160 Hạ Long, Vũng Tàu)
// Mặt bằng đo trên ảnh vệ tinh Google Maps: tỉ lệ 0,1468 m/px (đối chiếu tọa độ 2 điểm),
// đã hiệu chỉnh độ nghiêng ảnh vệ tinh cho các khối cao. Chiều cao ước lượng theo số tầng trong ảnh chụp.
// Hệ trục: x = trái→phải khi đứng trong sân nhìn vào khối nhà chính (+x ≈ hướng Tây Tây Nam 248°);
//          z dương = hướng ra đường Hạ Long (≈ Bắc Tây Bắc 338°); y = cao. Đơn vị: mét.
// Gốc toạ độ: trung điểm chân mặt tiền khối nhà chính.

export const FACADE_AZ = 338;

export function buildScene(THREE, opts = {}) {
  const tex = opts.textTexture || null;
  const root = new THREE.Group();
  root.name = 'NVHTN_BRVT';
  const labels = [];

  const M = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });
  const mat = {
    white: M(0xeeeae2), whiteDirty: M(0xd9d4c8), concrete: M(0xc9c4b8), slab: M(0xbdb7aa), raw: M(0xb9b2a4),
    glass: M(0x1f8f8a, { roughness: 0.15, metalness: 0.35 }), glassDark: M(0x176d6a, { roughness: 0.2, metalness: 0.3 }),
    mullion: M(0x4d5a58, { roughness: 0.5 }), asphalt: M(0x4a4c50), yard: M(0xb4ada0), ground: M(0xa7a58f), dirt: M(0xb9a88e),
    sidewalk: M(0xc8b9a6), courtBlue: M(0x2a55a8), courtOrange: M(0xe0643c), line: M(0xffffff), sea: M(0x5f8f9c, { roughness: 0.3 }),
    yellow: M(0xf2b51c), black: M(0x1b1b1d), red: M(0xd2232a), redDark: M(0xa8181f), gold: M(0xf5c518),
    trunk: M(0x6b4f3a), leaf: M(0x3f7a35), leaf2: M(0x5c9a3e), roofGreen: M(0x8fa69a, { metalness: 0.3, roughness: 0.6 }),
    roofPale: M(0xcfdcd2), tile: M(0xa0522d), beige: M(0xe7d3b0), pinkTrim: M(0xe8a07a),
    ctx: M(0xe4e1da, { transparent: true, opacity: 0.8 }), ctxGlass: M(0xbfd5d4, { transparent: true, opacity: 0.8 }),
    metal: M(0x9aa0a6, { metalness: 0.5, roughness: 0.4 }), blue: M(0x1e5bb8), chairR: M(0xd33b2f), chairY: M(0xf0c419),
    chairB: M(0x2b4fa0), wood: M(0xc98a3a), tiled: M(0xd8d2c4, { roughness: 0.4 }), median: M(0x7a9a5a),
  };

  // ---------- helpers ----------
  function box(parent, w, h, d, m, x, y, z, name) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y + h / 2, z); mesh.castShadow = true; mesh.receiveShadow = true;
    if (name) mesh.name = name; parent.add(mesh); return mesh;
  }
  const bmm = (p, x0, x1, y0, y1, z0, z1, m, name) => box(p, x1 - x0, y1 - y0, z1 - z0, m, (x0 + x1) / 2, y0, (z0 + z1) / 2, name);
  function cyl(parent, rT, rB, h, m, x, y, z, seg = 40, name) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, seg), m);
    mesh.position.set(x, y + h / 2, z); mesh.castShadow = true; mesh.receiveShadow = true;
    if (name) mesh.name = name; parent.add(mesh); return mesh;
  }
  function flat(parent, w, d, m, x, y, z, rot = 0, name) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m);
    mesh.rotation.x = -Math.PI / 2; mesh.rotation.z = rot; mesh.position.set(x, y, z); mesh.receiveShadow = true;
    if (name) mesh.name = name; parent.add(mesh); return mesh;
  }
  // đa giác nằm ngang từ các điểm [x,z]
  function poly(parent, pts, m, y, name) {
    const sh = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(sh), m);
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; mesh.receiveShadow = true;
    if (name) mesh.name = name; parent.add(mesh); return mesh;
  }
  // dải đường giữa 2 điểm
  function strip(parent, a, b, w, m, y, name) {
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    const mesh = flat(parent, L, w, m, (a[0] + b[0]) / 2, y, (a[1] + b[1]) / 2, 0, name);
    mesh.rotation.z = Math.atan2(dz, dx) * -1; return mesh;
  }
  function textPlane(parent, text, w, h, x, y, z, rotY = 0, style = {}) {
    if (!tex) return null;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex(text, w, h, style), transparent: true }));
    p.position.set(x, y, z); p.rotation.y = rotY; parent.add(p); return p;
  }
  function group(name, parent = root) { const g = new THREE.Group(); g.name = name; parent.add(g); return g; }
  const label = (text, x, y, z, kind = 'zone') => labels.push({ text, pos: [x, y, z], kind });

  // ---------- NỀN, RANH ĐẤT, ĐƯỜNG ----------
  const site = group('Nen_va_duong');
  flat(site, 700, 700, mat.ground, -40, -0.05, 0, 0, 'Nen_ngoai');
  // ranh khuôn viên (đo từ vệ tinh)
  const SITE = [[26, 37.5], [-25, 37.5], [-54.6, 42.8], [-99.6, 28.6], [-100.7, -35.2], [26, -35.2]];
  poly(site, SITE, mat.yard, 0, 'Khuon_vien');
  poly(site, [[-62, 18], [-62, -35.2], [-100.7, -35.2], [-99.6, 28.6], [-62, 40]], mat.dirt, 0.01, 'Bai_dat_trong_phia_Dong');
  // vỉa hè / sân trước cổng
  flat(site, 170, 12.5, mat.sidewalk, 40, 0.02, 43.75, 0, 'Via_he_san_truoc_cong');
  // Đường Hạ Long: 2 làn xe + dải phân cách
  flat(site, 260, 13, mat.asphalt, 60, 0.03, 56.5, 0, 'Duong_Ha_Long_lan_trong');
  flat(site, 260, 4, mat.median, 60, 0.04, 65, 0, 'Dai_phan_cach');
  flat(site, 260, 13, mat.asphalt, 60, 0.03, 73.5, 0, 'Duong_Ha_Long_lan_ngoai');
  flat(site, 260, 8, mat.sidewalk, 60, 0.03, 84, 0, 'Bo_ke');
  flat(site, 260, 120, mat.sea, 60, -0.3, 148, 0, 'Bien');
  for (let x = -60; x < 190; x += 8) { flat(site, 4, 0.2, mat.line, x, 0.05, 56.5); flat(site, 4, 0.2, mat.line, x, 0.05, 73.5); }
  label('Đường Hạ Long', 40, 1, 60, 'context');
  // Đường Trương Công Định (ra ngã ba với Hạ Long)
  strip(site, [-20, 66], [-102, 42.6], 12, mat.asphalt, 0.031, 'Duong_Truong_Cong_Dinh');
  strip(site, [-102, 42.6], [-180, 22], 12, mat.asphalt, 0.031);
  flat(site, 40, 30, mat.asphalt, -18, 0.029, 62, 0, 'Nga_ba');
  label('Đường Trương Công Định', -70, 1, 58, 'context');
  // Đường Phan Bội Châu
  flat(site, 10, 220, mat.asphalt, -106, 0.032, -60, 0, 'Duong_Phan_Boi_Chau');
  label('Đường Phan Bội Châu', -106, 1, -40, 'context');

  // ---------- KHỐI NHÀ CHÍNH (5 tầng, mặt kính) · rộng 41,8 m × sâu ~18 m ----------
  const main = group('Khoi_nha_chinh');
  const MX0 = -20.9, MX1 = 20.9, MZ0 = -18, H = 20;
  bmm(main, MX0, MX1, 0, H, MZ0, 0, mat.whiteDirty, 'Than_nha_chinh');
  bmm(main, MX0 - 0.3, MX1 + 0.3, H, H + 1, MZ0 - 0.3, 0.3, mat.white, 'Tuong_mai');
  bmm(main, -6, 6, H + 1, H + 3.2, -14, -6, mat.white, 'Tum_thang_mai');
  // mặt kính trung tâm
  const GX0 = -18.9, GX1 = 3.5;
  bmm(main, GX0, GX1, 5.6, 19.4, 0, 0.5, mat.glass, 'Mat_kinh_trung_tam');
  for (let x = GX0; x <= GX1 + 0.01; x += (GX1 - GX0) / 14) bmm(main, x - 0.06, x + 0.06, 5.6, 19.4, 0.5, 0.62, mat.mullion);
  for (let y = 5.6; y <= 19.41; y += 13.8 / 10) bmm(main, GX0, GX1, y - 0.05, y + 0.05, 0.5, 0.62, mat.mullion);
  for (let fl = 0; fl < 4; fl++) for (let i = 0; i < 4; i++)
    bmm(main, GX0 + 1.5 + i * 5.5, GX0 + 4.5 + i * 5.5, 7.3 + fl * 3.3, 8.9 + fl * 3.3, 0.62, 0.7, mat.glassDark);
  // tháp kính cầu thang
  bmm(main, 7, 12.5, 0.5, 19.6, 0, 1.0, mat.glass, 'Thap_kinh_cau_thang');
  for (let y = 0.5; y <= 19.6; y += 1.4) bmm(main, 7, 12.5, y - 0.05, y + 0.05, 1.0, 1.1, mat.mullion);
  for (let x = 7; x <= 12.51; x += 1.375) bmm(main, x - 0.05, x + 0.05, 0.5, 19.6, 1.0, 1.1, mat.mullion);
  for (let fl = 0; fl < 4; fl++) {
    bmm(main, 4.3, 6.3, 6.5 + fl * 4, 8.3 + fl * 4, 0, 0.12, mat.glass);
    bmm(main, -20.6, -19.4, 6.5 + fl * 4, 8.3 + fl * 4, 0, 0.12, mat.glass);
  }
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++)
    bmm(main, 13.4 + c * 1.5, 14.4 + c * 1.5, 1.6 + r * 1.6, 2.6 + r * 1.6, 0, 0.12, mat.black);
  const logo = cyl(main, 1.4, 1.4, 0.15, mat.red, 16.7, 17.2, 0.1, 32); logo.rotation.x = Math.PI / 2;
  textPlane(main, 'ĐOÀN TNCS HỒ CHÍ MINH\nTỈNH BÀ RỊA - VŨNG TÀU\nNHÀ VĂN HÓA THANH NIÊN', 7.4, 3.2, 16.7, 13.2, 0.13, 0, { color: '#2a7fd0' });
  for (let x = -19; x <= 19; x += 6) bmm(main, x - 0.3, x + 0.3, H + 1, H + 1.4, -0.2, 0.3, mat.metal);
  // sảnh
  bmm(main, -9.5, -0.5, 1.2, 4.6, 0, 0.15, mat.glassDark, 'Cua_sanh');
  bmm(main, -18.5, -10.5, 1.4, 4.4, 0, 0.18, mat.gold, 'Bang_Ho_Chi_Minh');
  textPlane(main, 'Không gian văn hóa HỒ CHÍ MINH', 7.6, 2.4, -14.5, 2.9, 0.2, 0, { color: '#c0161d', bg: '#f6d36b' });
  bmm(main, 0.5, 6.5, 3.6, 4.4, 0, 0.18, mat.blue, 'Bang_Ghi_danh');
  textPlane(main, 'GHI DANH', 5.6, 0.8, 3.5, 4.0, 0.2, 0, { color: '#ffffff', bg: '#1e5bb8' });
  bmm(main, -21, 7, 0, 1.2, 0, 4.5, mat.tiled, 'San_sanh');
  for (let i = 0; i < 4; i++) bmm(main, -23, 9, 0, 1.2 - i * 0.3, 4.5 + i * 0.7, 5.2 + i * 0.7, mat.concrete, 'Bac_tam_cap');
  bmm(main, -21.5, 7.5, 5.2, 6.4, -0.2, 5, mat.white, 'Mai_sanh');
  [-18.5, -13.5, -8.5, -3.5, 1.5, 6].forEach(x => cyl(main, 0.42, 0.42, 4.0, mat.beige, x, 1.2, 4.2, 16, 'Cot_sanh'));
  for (let i = 0; i < 12; i++) {
    const x = -19 + i * 2.1;
    cyl(main, 0.03, 0.03, 2.4, mat.metal, x, 6.4, 1.2, 6);
    bmm(main, x + 0.03, x + 0.75, 7.4, 8.7, 1.18, 1.22, mat.red, 'Co_do');
  }
  for (let i = 0; i < 8; i++) bmm(main, 8 + i * 0.6, 8.5 + i * 0.6, 1.2, 1.7, 2, 2.5, [mat.chairR, mat.chairY, mat.chairB][i % 3]);
  label('Khối nhà chính · 5 tầng · 42×18 m', 0, 25, -8);
  label('Sảnh chính & bậc tam cấp', -7, 7.5, 5);

  // ---------- KHỐI TRÒN · Ø ~21 m ----------
  const drum = group('Khoi_tron');
  const DX = -34.1, DZ = -11.5;
  cyl(drum, 10.5, 10.5, 18, mat.white, DX, 0, DZ, 64, 'Than_tron');
  cyl(drum, 11.7, 10.9, 1.3, mat.white, DX, 18, DZ, 64, 'Go_mai_tron');
  cyl(drum, 10, 11.1, 1.4, mat.slab, DX, 19.3, DZ, 64, 'Mai_tron');
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const b = box(drum, 0.8, 0.4, 0.2, mat.metal, DX + Math.cos(a) * 11.75, 18.4, DZ + Math.sin(a) * 11.75);
    b.rotation.y = -a + Math.PI / 2;
  }
  label('Khối tròn · Ø ~21 m', DX, 23, DZ);

  // ---------- KHỐI NHÀ MÁI NGŨ GIÁC, TẦNG TRỆT ĐỂ TRỐNG · ~35×33 m ----------
  const hall = group('Khoi_nha_tang_tret_trong');
  const HX0 = -63, HX1 = -28, HZ0 = -13.5, HZ1 = 19.6, HT = 15;
  bmm(hall, HX0, HX1, 5.4, 6, HZ0, HZ1, mat.slab, 'San_tang_2');
  bmm(hall, HX0, HX1, 6, HT, HZ0, HZ1, mat.white, 'Khoi_tren');
  bmm(hall, HX0 - 0.4, HX1 + 0.4, HT, HT + 0.8, HZ0 - 0.4, HZ1 + 0.4, mat.white, 'Tuong_mai');
  // mái ngũ giác nhô cao
  const pent = new THREE.Mesh(new THREE.CylinderGeometry(12.5, 14.5, 2.2, 5), mat.roofPale);
  pent.position.set((HX0 + HX1) / 2 - 1, HT + 1.1, (HZ0 + HZ1) / 2 + 1); pent.rotation.y = 0.32; pent.castShadow = true; pent.name = 'Mai_ngu_giac';
  hall.add(pent);
  // cửa sổ vuông + dải kính
  for (let z = HZ0 + 3; z < HZ1 - 1; z += 4.2) {
    bmm(hall, HX1, HX1 + 0.1, 11.6, 12.8, z, z + 1.1, mat.glass); bmm(hall, HX0 - 0.1, HX0, 11.6, 12.8, z, z + 1.1, mat.glass);
  }
  for (let x = HX0 + 2; x < HX1 - 1; x += 4.2) bmm(hall, x, x + 1.1, 11.6, 12.8, HZ1, HZ1 + 0.1, mat.glass);
  bmm(hall, HX0 + 3, HX1 - 3, 7, 10, HZ1, HZ1 + 0.12, mat.glass, 'Dai_kinh_mat_Bac');
  bmm(hall, HX1, HX1 + 0.12, 7, 10, 2, HZ1 - 2, mat.glass, 'Dai_kinh_mat_san');
  // lưới cột tầng trệt (bỏ phần bị khối tròn chiếm)
  for (let i = 0; i <= 5; i++) for (let j = 0; j <= 5; j++) {
    const x = HX0 + 0.8 + i * (HX1 - HX0 - 1.6) / 5, z = HZ0 + 0.8 + j * (HZ1 - HZ0 - 1.6) / 5;
    if (Math.hypot(x - DX, z - DZ) < 11.5) continue;
    box(hall, 0.9, 5.4, 0.9, mat.whiteDirty, x, 0, z, 'Cot_tang_tret');
  }
  bmm(hall, HX0, HX1, 0, 0.15, HZ0, HZ1, mat.tiled, 'San_gach_tang_tret');
  const st = box(hall, 2.2, 0.4, 11, mat.white, -45, 2.6, -8); st.rotation.x = 0.45;
  label('Tầng trệt để trống · ~35×33 m', -45, 4, 6);
  // sân khấu ngoài trời (tường đen) ở phía Nam dưới khối nhà
  const stage = group('San_khau_ngoai_troi', hall);
  const SX0 = -61, SX1 = -46, SZ = HZ0 + 0.6;
  bmm(stage, SX0, SX1, 0.15, 5.4, SZ, SZ + 0.7, mat.black, 'Tuong_den');
  bmm(stage, SX0, SX0 + 0.7, 0.15, 5.4, SZ + 0.7, SZ + 6, mat.black);
  bmm(stage, SX1 - 0.7, SX1, 0.15, 5.4, SZ + 0.7, SZ + 6, mat.black);
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.7, 48, 1, false, -Math.PI / 2, Math.PI), mat.slab);
  plat.position.set((SX0 + SX1) / 2, 0.5, SZ + 0.7); plat.castShadow = plat.receiveShadow = true; plat.name = 'Buc_san_khau'; stage.add(plat);
  bmm(stage, SX0 + 1.5, SX0 + 2.7, 0.85, 3.2, SZ + 1.5, SZ + 2.5, mat.black, 'Loa');
  bmm(stage, SX1 - 2.7, SX1 - 1.5, 0.85, 3.2, SZ + 1.5, SZ + 2.5, mat.black, 'Loa');
  for (let i = 0; i < 10; i++) bmm(stage, -57 + (i % 5) * 1.2, -56.5 + (i % 5) * 1.2, 0.85, 1.75, SZ + 4 + Math.floor(i / 5) * 1.2, SZ + 4.5 + Math.floor(i / 5) * 1.2, mat.wood);
  label('Sân khấu ngoài trời (tường đen)', (SX0 + SX1) / 2, 6.5, SZ + 4);

  // ---------- DÃY NHÀ 2 TẦNG PHÍA SAU · ~35×13 m ----------
  const east = group('Day_nha_2_tang_phia_sau');
  bmm(east, -85, -51, 0, 8, -31, -18, mat.beige, 'Day_nha_2_tang');
  bmm(east, -85.3, -50.7, 8, 8.5, -31.3, -17.7, mat.roofPale);
  for (let x = -83; x < -52; x += 4) { bmm(east, x, x + 1.6, 1.2, 3, -18, -17.9, mat.glassDark); bmm(east, x, x + 1.6, 5, 6.8, -18, -17.9, mat.glassDark); }
  for (let x = -84; x < -51; x += 8) bmm(east, x, x + 0.6, 0, 8, -18.1, -17.8, mat.pinkTrim);
  label('Dãy nhà 2 tầng phía sau', -68, 11, -24);

  // ---------- KHU ẨM THỰC "BẾN ĐỖ THANH NIÊN" (mặt Bắc khối mái ngũ giác) ----------
  const food = group('Khu_am_thuc_Ben_do_Thanh_nien');
  bmm(food, HX0 + 1, HX1 - 1, 4.2, 4.45, HZ1, HZ1 + 6, mat.roofGreen, 'Mai_che_am_thuc');
  for (let x = HX0 + 2; x < HX1 - 1; x += 6) cyl(food, 0.1, 0.1, 4.2, mat.white, x, 0, HZ1 + 5.7, 8);
  bmm(food, -50, -36, 6.4, 8.2, HZ1 + 0.13, HZ1 + 0.25, mat.blue, 'Bang_Ben_do');
  textPlane(food, 'YOUTH HAVEN · BẾN ĐỖ THANH NIÊN', 13.5, 1.7, -43, 7.3, HZ1 + 0.27, 0, { color: '#ffffff', bg: '#1d3fa8' });
  const cartCols = [mat.red, mat.beige, mat.blue, mat.chairY, mat.courtOrange, mat.white];
  function cart(x, z, i, rot = 0) {
    const c = new THREE.Group(); c.position.set(x, 0, z); c.rotation.y = rot; food.add(c);
    box(c, 3.2, 1.1, 1.6, cartCols[i % cartCols.length], 0, 0.4, 0);
    box(c, 3.0, 0.9, 1.4, mat.white, 0, 1.5, 0);
    box(c, 3.3, 0.08, 1.8, mat.redDark, 0, 2.4, 0);
    [-1.2, 1.2].forEach(dx => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.15, 14), mat.black); w.rotation.x = Math.PI / 2; w.position.set(dx, 0.35, 0.85); c.add(w); });
  }
  for (let i = 0; i < 7; i++) cart(HX0 + 4 + i * 4.6, HZ1 + 3, i);
  for (let i = 0; i < 6; i++) cart(-66 - i * 4.4, 30 - i * 0.6, i + 3);
  for (let i = 0; i < 6; i++) bmm(food, -92, -62, 4.6, 4.65, 24 + i * 2.2, 24.05 + i * 2.2, mat.metal);
  // quán mái ngói
  bmm(food, -96, -86, 0, 3.2, 14, 22, mat.wood, 'Quan_mai_ngoi');
  const roof = new THREE.Mesh(new THREE.ConeGeometry(7.8, 2.4, 4), mat.tile);
  roof.position.set(-91, 4.4, 18); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.8); roof.castShadow = true; food.add(roof);
  label('Khu ẩm thực "Bến đỗ Thanh niên"', -45, 6.5, HZ1 + 3);
  label('Dãy xe đẩy ẩm thực', -78, 4.5, 28);
  label('Bãi đất trống phía Đông', -82, 2, -5);

  // ---------- SÂN TRUNG TÂM · sân bóng rổ ----------
  // Sân trống giữa khối nhà chính, khối mái ngũ giác và mái che xe: ~45×37 m
  const court = group('San_trung_tam_bong_ro');
  const CX = -5.5, CZ = 18, CW = 28, CD = 15;
  flat(court, CW + 4, CD + 4, mat.courtOrange, CX, 0.05, CZ, 0, 'Vien_cam');
  flat(court, CW, CD, mat.courtBlue, CX, 0.06, CZ, 0, 'Mat_san_xanh');
  flat(court, 5.8, 4.9, mat.courtOrange, CX - CW / 2 + 2.9, 0.07, CZ);
  flat(court, 5.8, 4.9, mat.courtOrange, CX + CW / 2 - 2.9, 0.07, CZ);
  const cc = new THREE.Mesh(new THREE.CircleGeometry(1.8, 40), mat.courtOrange); cc.rotation.x = -Math.PI / 2; cc.position.set(CX, 0.07, CZ); court.add(cc);
  const ln = (w, d, x, z) => flat(court, w, d, mat.line, x, 0.08, z);
  ln(CW, 0.08, CX, CZ - CD / 2); ln(CW, 0.08, CX, CZ + CD / 2); ln(0.08, CD, CX - CW / 2, CZ); ln(0.08, CD, CX + CW / 2, CZ); ln(0.08, CD, CX, CZ);
  [-1, 1].forEach(sg => {
    const arc = new THREE.Mesh(new THREE.RingGeometry(6.7, 6.78, 48, 1, -Math.PI / 2, Math.PI), mat.line);
    arc.rotation.x = -Math.PI / 2; arc.rotation.z = sg > 0 ? Math.PI : 0; arc.position.set(CX + sg * (CW / 2 - 1.6), 0.08, CZ); court.add(arc);
  });
  const RX0 = CX - CW / 2 - 2.5, RX1 = CX + CW / 2 + 2.5, RZ0 = CZ - CD / 2 - 2.5, RZ1 = CZ + CD / 2 + 2.5;
  [[RX0, RX1, RZ0, RZ0], [RX0, RX1, RZ1, RZ1], [RX0, RX0, RZ0, RZ1], [RX1, RX1, RZ0, RZ1]].forEach(([a, b, c, d]) => {
    bmm(court, Math.min(a, b) - 0.06, Math.max(a, b) + 0.06, 0.55, 0.65, Math.min(c, d) - 0.06, Math.max(c, d) + 0.06, mat.yellow, 'Lan_can');
    const len = Math.max(b - a, d - c);
    for (let t = 0; t <= len; t += 3) box(court, 0.1, 0.6, 0.1, mat.yellow, a === b ? a : a + t, 0, c === d ? c : c + t);
  });
  [-1, 1].forEach(sg => {
    const bx = CX + sg * (CW / 2 + 1.6);
    bmm(court, bx - 0.8, bx + 0.8, 0, 0.6, CZ - 1, CZ + 1, mat.black);
    const p = box(court, 0.2, 3.6, 0.2, mat.black, bx, 0.6, CZ); p.rotation.z = sg * 0.35;
    bmm(court, bx - sg * 1.4 - 0.05, bx - sg * 1.4 + 0.05, 3.0, 4.1, CZ - 0.9, CZ + 0.9, mat.ctxGlass, 'Bang_ro');
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 6, 20), mat.courtOrange);
    hoop.rotation.x = Math.PI / 2; hoop.position.set(bx - sg * 1.7, 3.05, CZ); court.add(hoop);
  });
  label('Sân bóng rổ 28×15 m', CX, 3, CZ);
  label('Sân trung tâm · ~45×37 m', 8, 2, 32);

  // ---------- MÁI CHE GIỮ XE (phía Tây sân) · ~7×34 m ----------
  const park = group('Mai_che_giu_xe');
  bmm(park, 17, 24.3, 3.6, 3.8, -7, 26.5, mat.white, 'Mai_che');
  for (let z = -6.5; z <= 26; z += 5.5) { cyl(park, 0.1, 0.1, 3.6, mat.metal, 17.4, 0, z, 8); cyl(park, 0.1, 0.1, 3.6, mat.metal, 23.9, 0, z, 8); }
  const carCols = [0xf2f2f2, 0x222428, 0x9aa0a6, 0x1d2b4a, 0xdddddd];
  for (let i = 0; i < 5; i++) {
    const z = -5 + i * 5.2, m = M(carCols[i % 5], { metalness: 0.4, roughness: 0.4 });
    bmm(park, 18.2, 22.9, 0.3, 1.2, z, z + 2.0, m); bmm(park, 19, 21.7, 1.2, 1.75, z + 0.15, z + 1.85, mat.glassDark);
  }
  for (let i = 0; i < 10; i++) bmm(park, 18, 19.8, 0.2, 1.1, 18 + i * 0.85, 18.35 + i * 0.85, i % 2 ? mat.black : mat.redDark);
  label('Mái che giữ xe', 20.6, 5.5, 10);
  // giữ xe máy cạnh cổng (phía Đông)
  for (let i = 0; i < 12; i++) bmm(park, -27 + (i % 2) * 2.2, -25.2 + (i % 2) * 2.2, 0.2, 1.1, 26 + Math.floor(i / 2) * 1.0, 26.35 + Math.floor(i / 2) * 1.0, i % 3 ? mat.black : mat.redDark);
  label('Giữ xe máy', -25, 3, 29);

  // ---------- CỔNG, KIOSK MIXUE, TƯỜNG RÀO ----------
  const gate = group('Cong_va_tuong_rao');
  const KX = -15.3, KZ = 36.4;
  cyl(gate, 3.2, 3.2, 3.6, mat.white, KX, 0, KZ, 40, 'Kiosk_Mixue');
  cyl(gate, 4.0, 3.8, 0.9, mat.red, KX, 3.4, KZ, 40);
  bmm(gate, KX - 4.2, KX + 4.2, 4.3, 6.0, KZ + 3.0, KZ + 3.8, mat.red, 'Bien_Mixue');
  textPlane(gate, 'MIXUE', 7.6, 1.5, KX, 5.15, KZ + 3.85, 0, { color: '#ffffff', bg: '#d2232a' });
  label('Kiosk Mixue · Youth Haven', KX, 7.5, KZ);
  // cổng: từ kiosk sang trụ phía Tây (~11 m)
  cyl(gate, 0.25, 0.25, 7, mat.white, 0.5, 0, 37.6, 12, 'Tru_cong');
  bmm(gate, -11.5, 0.5, 5.3, 7.1, 37.5, 37.7, mat.red, 'Bang_ron_cong');
  textPlane(gate, 'SÂN KHẤU THẾ GIỚI TRẺ', 11.6, 1.6, -5.5, 6.2, 37.75, 0, { color: '#ffffff', bg: '#b81d24' });
  bmm(gate, -3.5, -0.5, 0, 1.8, 36.6, 37.6, mat.metal, 'Cong_xep');
  // nhà biển quảng cáo phía Tây cổng
  bmm(gate, 2.5, 13, 0, 3.6, 31.5, 37.4, mat.white, 'Nha_bien_quang_cao');
  bmm(gate, 2.2, 13.3, 3.6, 3.9, 31.2, 37.8, mat.white);
  bmm(gate, 3.2, 12, 0.4, 3.4, 37.4, 37.55, mat.redDark, 'Bien_quang_cao');
  label('Cổng chính (đường Hạ Long)', -5.5, 9, 38);
  // tường rào theo ranh đất
  const fence = (a, b) => {
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    const w = box(gate, L, 1.2, 0.3, mat.white, (a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2, 'Tuong_rao');
    w.rotation.y = -Math.atan2(dz, dx);
  };
  fence([13, 37.5], [26, 37.5]); fence([26, 37.5], [26, -35.2]); fence([26, -35.2], [-100.7, -35.2]);
  fence([-100.7, -35.2], [-99.6, 28.6]); fence([-99.6, 28.6], [-54.6, 42.8]); fence([-54.6, 42.8], [-25, 37.5]); fence([-25, 37.5], [-18.6, 37.5]);
  [[-21, 33], [-22.5, 33], [-24, 33]].forEach(([x, z], i) => {
    cyl(gate, 0.07, 0.1, 11, mat.metal, x, 0, z, 10, 'Cot_co');
    if (i === 0) bmm(gate, x + 0.08, x + 2.6, 9.0, 10.8, z - 0.03, z + 0.03, mat.red, 'Quoc_ky');
  });

  // ---------- CÂY XANH (vị trí tán cây theo ảnh vệ tinh) ----------
  const trees = group('Cay_xanh');
  function tree(x, z, s = 1, kind = 0) {
    cyl(trees, 0.25 * s, 0.35 * s, 3.2 * s, mat.trunk, x, 0, z, 8);
    const lm = kind ? mat.leaf2 : mat.leaf;
    [[0, 4.6, 0, 2.6], [1.6, 4.0, 0.6, 1.9], [-1.4, 4.2, -0.8, 2.0], [0.4, 5.6, -1.2, 1.7], [-0.6, 3.9, 1.5, 1.7]].forEach(([dx, dy, dz, r]) => {
      const sph = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), lm);
      sph.position.set(x + dx * s, dy * s, z + dz * s); sph.castShadow = true; trees.add(sph);
    });
  }
  tree(-40, 39, 1.8); tree(-48, 34, 1.6, 1); tree(-32, 44, 1.5); tree(-58, 38, 1.4, 1); tree(-24, 41, 1.1, 1);
  tree(13, 36, 1.7); tree(20, 31, 1.5, 1); tree(7, 41, 1.3); tree(24, 40, 1.2, 1);
  tree(-96, -10, 1.3, 1); tree(-96, 4, 1.2); tree(-60, -30, 1.2, 1); tree(15, -28, 1.3);

  // ---------- CÔNG TRÌNH XUNG QUANH (khối nhạt) ----------
  const ctx = group('Cong_trinh_xung_quanh');
  // Fusion Suites (bên kia đường Phan Bội Châu)
  bmm(ctx, -152, -122, 0, 78, -15, 25, mat.ctx, 'Fusion_Suites');
  for (let y = 6; y < 78; y += 6) bmm(ctx, -152.2, -121.8, y, y + 0.6, -15.2, 25.2, mat.ctxGlass);
  label('Fusion Suites Vũng Tàu', -137, 82, 5, 'context');
  // Khách sạn Bưu Điện Vũng Tàu (khối trắng 9 tầng bên phải)
  bmm(ctx, 42, 66, 0, 30, -2, 33, mat.ctx, 'Khach_san_Buu_Dien');
  for (let y = 7; y < 30; y += 3.2) bmm(ctx, 41.8, 66.2, y, y + 1.2, -2.2, 33.2, mat.ctxGlass);
  label('Khách sạn Bưu Điện Vũng Tàu', 54, 34, 15, 'context');
  bmm(ctx, 27, 41, 0, 7, 2, 30, mat.ctx, 'TGT_Club');
  label('TGT Club', 34, 9, 16, 'context');
  // nhà dân phía sau và hai bên
  for (let i = 0; i < 10; i++) bmm(ctx, -98 + i * 12.5, -88 + i * 12.5, 0, 7 + (i * 37 % 9), -66, -38, mat.ctx);
  for (let i = 0; i < 4; i++) bmm(ctx, -135, -113, 0, 8 + i * 3, -70 + i * 13, -59 + i * 13, mat.ctx);
  bmm(ctx, 28, 66, 0, 10, -38, -6, mat.ctx);
  bmm(ctx, -150, -112, 0, 12, 34, 60, mat.ctx);

  // ---------- la bàn ----------
  const north = group('Huong_Bac');
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5, 3), mat.red);
  arrow.rotation.x = Math.PI / 2;
  north.position.set(40, 0.6, 46);
  north.rotation.y = -((360 - FACADE_AZ) * Math.PI / 180); // Bắc lệch 22° so với trục +z
  north.add(arrow);
  label('Bắc', 39, 3, 49, 'context');

  return { root, labels, context: ctx };
}
