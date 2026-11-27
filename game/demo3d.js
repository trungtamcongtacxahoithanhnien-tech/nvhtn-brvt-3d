// Đồ hoạ kiểu "Pokémon GO" cho BẢN DEMO: linh vật cho từng địa danh, nhân vật người chơi,
// bản đồ hoạt hình 3D dựng từ dữ liệu OpenStreetMap (đường, nhà, công viên, mặt nước).
// Toàn bộ là thiết kế gốc dựng bằng khối hình học — không dùng hình ảnh có bản quyền.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const toon = (c, o = {}) => new THREE.MeshToonMaterial({ color: c, ...o });
const SPH = new THREE.SphereGeometry(1, 24, 18);
function blob(c, sx, sy, sz, x, y, z, parent) {
  const m = new THREE.Mesh(SPH, toon(c)); m.scale.set(sx, sy, sz); m.position.set(x, y, z); parent.add(m); return m;
}
function add(geo, c, x, y, z, parent, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, toon(c)); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m); return m;
}

// ================= LINH VẬT =================
const MASCOT = {
  nvhtn: { c: '#4fa3e0', nm: 'Bé Thanh' },
  benthanh: { c: '#f2c14e', nm: 'Tích Tắc' },
  dinh: { c: '#f4f1e8', nm: 'Dinh Dinh' },
  nharong: { c: '#5cc27a', nm: 'Rồng Con' },
  cuchi: { c: '#a0704a', nm: 'Chũi Củ Chi' },
  haidang: { c: '#ffffff', nm: 'Đèn Biển' },
  bachdinh: { c: '#fbf1dc', nm: 'Bạch Bạch' },
  condao: { c: '#7fd0a8', nm: 'Rùa Biển' },
  sonmai: { c: '#2d2222', nm: 'Sơn Mài' },
  ducba: { c: '#df806e', nm: 'Gạch Hồng' },
  buudien: { c: '#f6d47c', nm: 'Thư Thư' },
  nhahat: { c: '#f7c9d8', nm: 'Ca Ca' },
  nguyenhue: { c: '#ff9ec0', nm: 'Hoa Phố' },
  landmark: { c: '#86cdea', nm: 'Tre Cao' },
  thuthiem: { c: '#eef3f8', nm: 'Cầu Vồng' },
  nuinho: { c: '#86cf7e', nm: 'Núi Xinh' },
};
export const mascotName = icon => (MASCOT[icon] || {}).nm || '';

export function mascot(icon) {
  const P = MASCOT[icon] || { c: '#bbb' };
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  let bodyH = 1;
  if (icon === 'landmark') bodyH = 1.45;
  if (icon === 'condao') bodyH = 0.8;
  // thân
  blob(P.c, 0.5, 0.52 * bodyH, 0.48, 0, 0.52 * bodyH, 0, body);
  // chân, tay
  const dark = new THREE.Color(P.c).multiplyScalar(0.78).getStyle();
  blob(dark, 0.15, 0.08, 0.18, -0.2, 0.06, 0.08, body); blob(dark, 0.15, 0.08, 0.18, 0.2, 0.06, 0.08, body);
  blob(P.c, 0.1, 0.16, 0.1, -0.47, 0.5 * bodyH, 0.05, body).rotation.z = 0.5;
  blob(P.c, 0.1, 0.16, 0.1, 0.47, 0.5 * bodyH, 0.05, body).rotation.z = -0.5;
  // mắt, má
  const ey = 0.66 * bodyH;
  for (const s of [-1, 1]) {
    blob('#ffffff', 0.12, 0.14, 0.06, s * 0.17, ey, 0.43, body);
    blob('#1d1d2b', 0.075, 0.09, 0.05, s * 0.17, ey - 0.01, 0.47, body);
    blob('#ffffff', 0.025, 0.025, 0.02, s * 0.17 + 0.03, ey + 0.04, 0.51, body);
    blob('#ff8fa3', 0.07, 0.04, 0.02, s * 0.3, ey - 0.13, 0.4, body);
  }
  // miệng
  add(new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI), '#5a2a2a', 0, ey - 0.14, 0.47, body, 0, 0, Math.PI);
  const top = 1.04 * bodyH;
  const acc = new THREE.Group(); body.add(acc);
  switch (icon) {
    case 'nvhtn': // khăn quàng + mũ tai bèo xanh
      add(new THREE.TorusGeometry(0.36, 0.06, 8, 24), '#e74c3c', 0, 0.38, 0, acc, Math.PI / 2);
      blob('#e74c3c', 0.06, 0.12, 0.03, 0.12, 0.26, 0.4, acc).rotation.z = 0.3;
      add(new THREE.CylinderGeometry(0.42, 0.45, 0.05, 24), '#2e7d5b', 0, top - 0.06, 0, acc);
      blob('#2e7d5b', 0.3, 0.16, 0.3, 0, top - 0.04, 0, acc);
      break;
    case 'benthanh': { // tháp đồng hồ
      add(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 24), '#ffffff', 0, 0.42, 0.47, acc, Math.PI / 2);
      add(new THREE.BoxGeometry(0.02, 0.13, 0.02), '#333', 0, 0.47, 0.49, acc);
      add(new THREE.BoxGeometry(0.1, 0.02, 0.02), '#333', 0.04, 0.42, 0.49, acc);
      add(new THREE.BoxGeometry(0.26, 0.26, 0.26), '#e0a63a', 0, top + 0.08, 0, acc);
      add(new THREE.ConeGeometry(0.24, 0.26, 4), '#c0392b', 0, top + 0.34, 0, acc, 0, Math.PI / 4);
      break; }
    case 'dinh': // mái bằng rộng + lá cây
      add(new THREE.BoxGeometry(0.9, 0.06, 0.5), '#d9d4c7', 0, top - 0.02, 0, acc);
      add(new THREE.BoxGeometry(0.6, 0.12, 0.34), '#ece8dd', 0, top + 0.07, 0, acc);
      blob('#4caf50', 0.08, 0.14, 0.04, 0.05, top + 0.22, 0, acc).rotation.z = -0.4;
      break;
    case 'nharong': // sừng, gai lưng, đuôi
      add(new THREE.ConeGeometry(0.07, 0.25, 10), '#f7d35c', -0.18, top + 0.04, 0, acc, 0, 0, 0.3);
      add(new THREE.ConeGeometry(0.07, 0.25, 10), '#f7d35c', 0.18, top + 0.04, 0, acc, 0, 0, -0.3);
      for (let i = 0; i < 4; i++) add(new THREE.ConeGeometry(0.07, 0.18, 6), '#f39c4a', 0, 0.85 - i * 0.18, -0.4 + i * 0.02, acc, -0.7);
      add(new THREE.ConeGeometry(0.14, 0.5, 10), '#5cc27a', 0, 0.2, -0.55, acc, -1.2);
      break;
    case 'cuchi': // nón lá + mũi hồng
      add(new THREE.ConeGeometry(0.5, 0.3, 24), '#e8d39a', 0, top + 0.08, 0, acc);
      blob('#ff9aa8', 0.06, 0.05, 0.05, 0, 0.55, 0.5, acc);
      break;
    case 'haidang': // sọc đỏ + đèn sáng
      for (const y of [0.3, 0.62]) add(new THREE.TorusGeometry(0.49, 0.05, 8, 32), '#e74c3c', 0, y, 0, acc, Math.PI / 2);
      add(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 16), '#333', 0, top + 0.06, 0, acc);
      blob('#fff27a', 0.13, 0.13, 0.13, 0, top + 0.12, 0, acc).material.emissive = new THREE.Color('#ffd400');
      add(new THREE.ConeGeometry(0.2, 0.2, 16), '#e74c3c', 0, top + 0.32, 0, acc);
      break;
    case 'bachdinh': // mái ngói đỏ
      add(new THREE.ConeGeometry(0.5, 0.34, 4), '#c8553d', 0, top + 0.1, 0, acc, 0, Math.PI / 4);
      break;
    case 'condao': // mai rùa + chân chèo
      blob('#3e8f6b', 0.5, 0.32, 0.5, 0, 0.62, -0.08, acc);
      for (const s of [-1, 1]) blob('#7fd0a8', 0.24, 0.05, 0.12, s * 0.5, 0.3, 0.15, acc).rotation.y = s * 0.5;
      break;
    case 'sonmai': // bụng đỏ son + chấm vàng
      blob('#c0392b', 0.3, 0.3, 0.1, 0, 0.42, 0.4, acc);
      for (let i = 0; i < 7; i++) { const a = i * 0.9; blob('#f4c542', 0.035, 0.035, 0.035, Math.cos(a) * 0.4, 0.3 + (i % 3) * 0.22, Math.sin(a) * 0.15 + 0.3, acc); }
      add(new THREE.TorusGeometry(0.12, 0.03, 8, 16), '#f4c542', 0, top + 0.08, 0, acc);
      break;
    case 'ducba': // hai tháp chuông
      for (const s of [-1, 1]) {
        add(new THREE.BoxGeometry(0.16, 0.3, 0.16), '#c96a58', s * 0.22, top + 0.06, 0, acc);
        add(new THREE.ConeGeometry(0.12, 0.3, 4), '#6d7b8c', s * 0.22, top + 0.36, 0, acc, 0, Math.PI / 4);
      }
      break;
    case 'buudien': // phong thư + mái vòm xanh
      add(new THREE.BoxGeometry(0.4, 0.26, 0.04), '#ffffff', 0, 0.38, 0.46, acc);
      add(new THREE.BoxGeometry(0.26, 0.03, 0.02), '#e74c3c', -0.09, 0.42, 0.49, acc, 0, 0, -0.55);
      add(new THREE.BoxGeometry(0.26, 0.03, 0.02), '#e74c3c', 0.09, 0.42, 0.49, acc, 0, 0, 0.55);
      blob('#4f9d8a', 0.3, 0.16, 0.3, 0, top - 0.02, 0, acc);
      break;
    case 'nhahat': // vương miện vòm vàng
      add(new THREE.TorusGeometry(0.25, 0.04, 8, 24, Math.PI), '#f4c542', 0, top - 0.02, 0, acc);
      blob('#f4c542', 0.06, 0.06, 0.06, 0, top + 0.25, 0, acc);
      break;
    case 'nguyenhue': // bông hoa trên đầu
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; blob('#ff6f9c', 0.12, 0.05, 0.08, Math.cos(a) * 0.15, top + 0.04, Math.sin(a) * 0.15, acc).rotation.y = -a; }
      blob('#ffd54f', 0.08, 0.06, 0.08, 0, top + 0.07, 0, acc);
      break;
    case 'landmark': // đốt tre + ăng-ten
      for (const y of [0.45, 0.85, 1.2]) add(new THREE.TorusGeometry(0.47 - Math.abs(y - 0.8) * 0.12, 0.03, 8, 32), '#4b9cc0', 0, y, 0, acc, Math.PI / 2);
      add(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), '#9aa', 0, top + 0.2, 0, acc);
      blob('#ff5252', 0.04, 0.04, 0.04, 0, top + 0.42, 0, acc).material.emissive = new THREE.Color('#ff2020');
      break;
    case 'thuthiem': { // trụ cầu + dây văng
      add(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 8), '#b0bec5', 0, top + 0.28, 0, acc);
      for (let i = -3; i <= 3; i++) if (i) {
        const len = 0.18 + Math.abs(i) * 0.1, m = add(new THREE.CylinderGeometry(0.008, 0.008, len, 4), '#e57373', i * 0.06, top + 0.5 - len / 2 * 0.8, 0, acc);
        m.rotation.z = -Math.sign(i) * 0.6;
      }
      break; }
    case 'nuinho': // đỉnh núi + cây
      add(new THREE.ConeGeometry(0.22, 0.4, 8), '#5fae5a', -0.12, top + 0.12, 0, acc);
      add(new THREE.ConeGeometry(0.16, 0.3, 8), '#6fbf68', 0.16, top + 0.06, 0.05, acc);
      blob('#ffffff', 0.06, 0.04, 0.06, -0.12, top + 0.3, 0, acc);
      break;
  }
  // bóng dưới chân
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.01; g.add(sh);
  const ph = Math.random() * 6;
  g.userData.anim = t => { const b = Math.abs(Math.sin(t * 3 + ph)); body.position.y = b * 0.12; body.scale.set(1 + (1 - b) * 0.05, 1 - (1 - b) * 0.05, 1 + (1 - b) * 0.05); sh.scale.setScalar(1 - b * 0.2); };
  g.userData.body = body;
  return g;
}

// Ảnh PNG của linh vật (dùng ở màn bắt qua camera, sổ tay)
let mr = null; const mcache = {};
export function mascotImage(icon) {
  if (mcache[icon]) return mcache[icon];
  try {
    if (!mr) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 320;
      mr = { r: new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, preserveDrawingBuffer: true }), sc: new THREE.Scene(), cam: new THREE.PerspectiveCamera(30, 1, 0.1, 20) };
      mr.r.setClearColor(0, 0); mr.r.outputColorSpace = THREE.SRGBColorSpace;
      mr.sc.add(new THREE.HemisphereLight(0xffffff, 0x99aabb, 2.2)); const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(2, 4, 5); mr.sc.add(d);
      mr.cam.position.set(0, 1.1, 4.2); mr.cam.lookAt(0, 0.62, 0);
    }
    const m = mascot(icon); m.rotation.y = -0.35; mr.sc.add(m);
    const box = new THREE.Box3().setFromObject(m), h = box.max.y;
    mr.cam.position.set(0, h * 0.62 + 0.25, 2.6 + h * 1.3); mr.cam.lookAt(0, h * 0.5, 0);
    mr.r.render(mr.sc, mr.cam);
    mcache[icon] = mr.r.domElement.toDataURL('image/png');
    mr.sc.remove(m);
  } catch (e) { mcache[icon] = ''; }
  return mcache[icon];
}

// ================= NHÂN VẬT NGƯỜI CHƠI =================
export const SHIRTS = ['#1e88e5', '#e53935', '#43a047', '#fdd835', '#8e24aa', '#fb8c00', '#00acc1', '#ec407a'];
export function avatar({ gender = 'nam', shirt = '#1e88e5' } = {}) {
  const g = new THREE.Group(), skin = '#f6d0ac', hair = '#2b2118', pants = gender === 'nu' ? '#37474f' : '#2f3e5c';
  const cap = (r, l, c) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, 12), toon(c));
  const limb = (r, l, c, x, y, parent) => { const p = new THREE.Group(); p.position.set(x, y, 0); const m = cap(r, l, c); m.position.y = -l / 2 - r * 0.4; p.add(m); parent.add(p); return p; };
  const legL = limb(0.1, 0.36, pants, -0.11, 0.62, g), legR = limb(0.1, 0.36, pants, 0.11, 0.62, g);
  for (const L of [legL, legR]) { const sh = blob('#3b3b3b', 0.1, 0.07, 0.15, 0, -0.56, 0.04, L); }
  const torso = cap(0.24, 0.3, shirt); torso.position.y = 0.95; g.add(torso);
  if (gender === 'nu') { const sk = new THREE.Mesh(new THREE.ConeGeometry(0.33, 0.32, 20, 1, true), toon(shirt)); sk.position.y = 0.66; g.add(sk); }
  const armL = limb(0.07, 0.32, shirt, -0.3, 1.13, g), armR = limb(0.07, 0.32, shirt, 0.3, 1.13, g);
  for (const A of [armL, armR]) blob(skin, 0.07, 0.07, 0.07, 0, -0.5, 0, A);
  armL.rotation.z = 0.12; armR.rotation.z = -0.12;
  const head = new THREE.Group(); head.position.y = 1.5; g.add(head);
  blob(skin, 0.33, 0.33, 0.33, 0, 0, 0, head);
  for (const s of [-1, 1]) { blob('#1d1d2b', 0.045, 0.06, 0.03, s * 0.11, 0.0, 0.3, head); blob('#ff9aa8', 0.05, 0.03, 0.02, s * 0.2, -0.08, 0.27, head); }
  // tóc
  const hc = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), toon(hair));
  hc.position.y = 0.04; hc.rotation.x = -0.25; head.add(hc);
  if (gender === 'nu') {
    blob(hair, 0.3, 0.36, 0.18, 0, -0.12, -0.18, head);
    blob(hair, 0.11, 0.2, 0.11, 0, 0.1, -0.42, head).rotation.x = 0.6;
    blob(shirt, 0.07, 0.05, 0.07, 0, 0.22, -0.36, head);
  } else {
    // mũ lưỡi trai cùng màu áo
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 20, 1, false, -Math.PI / 2, Math.PI), toon(shirt));
    brim.position.set(0, 0.17, 0.2); brim.rotation.x = 0.15; head.add(brim);
    const ct = new THREE.Mesh(new THREE.SphereGeometry(0.355, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.32), toon(shirt)); ct.position.y = 0.06; head.add(ct);
  }
  const sh = new THREE.Mesh(new THREE.CircleGeometry(0.4, 24), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.2, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.02; g.add(sh);
  g.userData.walk = (ph, amt) => {
    const s = Math.sin(ph) * 0.75 * amt;
    legL.rotation.x = s; legR.rotation.x = -s; armL.rotation.x = -s * 0.8; armR.rotation.x = s * 0.8;
    torso.position.y = 0.95 + Math.abs(Math.cos(ph)) * 0.04 * amt; head.position.y = 1.5 + Math.abs(Math.cos(ph)) * 0.04 * amt;
  };
  return g;
}
export function avatarImage(opt) {   // ảnh nhỏ cho màn chọn nhân vật
  mascotImage('nvhtn');   // khởi tạo renderer
  const a = avatar(opt); a.rotation.y = -0.4; mr.sc.add(a);
  mr.cam.position.set(0, 1.25, 4.6); mr.cam.lookAt(0, 0.95, 0); mr.r.render(mr.sc, mr.cam);
  const u = mr.r.domElement.toDataURL('image/png'); mr.sc.remove(a); return u;
}

// ================= BẢN ĐỒ HOẠT HÌNH =================
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
async function fetchOSM(lat, lon, R) {
  const ck = `osm-cache-${lat.toFixed(4)},${lon.toFixed(4)},${R}`;
  try { const c = localStorage.getItem(ck); if (c) return JSON.parse(c); } catch { }
  const a = `(around:${R},${lat},${lon})`;
  const q = `[out:json][timeout:25];(way["highway"]${a};way["building"]${a};way["leisure"~"park|garden|pitch|playground|stadium"]${a};way["landuse"~"grass|recreation_ground|village_green|forest"]${a};way["natural"~"water|wood|scrub"]${a};way["waterway"~"river|canal"]${a};);out geom;`;
  for (const u of OVERPASS) {
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 20000);
      const r = await fetch(u, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal });
      clearTimeout(tm); if (!r.ok) continue;
      const j = await r.json(), slim = j.elements.filter(e => e.geometry).map(e => ({ t: e.tags || {}, g: e.geometry.map(p => [+p.lat.toFixed(7), +p.lon.toFixed(7)]) }));
      try { localStorage.setItem(ck, JSON.stringify(slim)); } catch { }
      return slim;
    } catch { }
  }
  return null;
}
const ROADW = { motorway: 14, trunk: 13, primary: 12, secondary: 10, tertiary: 8, residential: 6, unclassified: 6, living_street: 5, service: 4, pedestrian: 4, footway: 2.4, path: 2, steps: 2, cycleway: 2.4, track: 3 };
function stripGeo(pts, w, y) {   // dải đường phẳng + nút tròn ở khớp
  const parts = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, z1] = pts[i], [x2, z2] = pts[i + 1], dx = x2 - x1, dz = z2 - z1, L = Math.hypot(dx, dz); if (L < 0.01) continue;
    const g = new THREE.PlaneGeometry(L, w); g.rotateX(-Math.PI / 2); g.rotateY(-Math.atan2(dz, dx)); g.translate((x1 + x2) / 2, y, (z1 + z2) / 2); parts.push(g);
  }
  for (const [x, z] of pts) { const c = new THREE.CircleGeometry(w / 2, 12); c.rotateX(-Math.PI / 2); c.translate(x, y, z); parts.push(c); }
  return parts;
}
function shapeOf(pts) { const s = new THREE.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); return s; }

export function createWorld({ host, center, toXZ, cps, getState, onTapCp, onTapGround, onFrame }) {
  const W = () => host.clientWidth || innerWidth, H = () => host.clientHeight || innerHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W(), H()); renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); const SKY = new THREE.Color('#bfe8ff');
  scene.background = SKY; scene.fog = new THREE.Fog(SKY, 70, 230);
  const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.5, 600);
  camera.position.set(0, 26, 30);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x88aa88, 1.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5); sun.position.set(40, 80, 30); scene.add(sun);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(900, 48), toon('#a8e29b')); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 10; controls.maxDistance = 80;
  controls.minPolarAngle = 0.35; controls.maxPolarAngle = 1.2; controls.rotateSpeed = 0.6;

  // ---- bản đồ OSM ----
  const status = document.createElement('div');
  Object.assign(status.style, { position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%,-50%)', background: 'rgba(255,255,255,.9)', padding: '8px 14px', borderRadius: '16px', fontWeight: 700, color: '#1d4f86', zIndex: 2, pointerEvents: 'none' });
  status.textContent = '🗺️ Đang dựng bản đồ…'; host.appendChild(status);
  fetchOSM(center.lat, center.lon, 420).then(data => {
    status.remove();
    if (!data) { const t = document.createElement('div'); t.style.cssText = status.style.cssText; t.style.top = '30%'; t.textContent = 'Không tải được dữ liệu đường phố — chỉ hiện nền'; host.appendChild(t); setTimeout(() => t.remove(), 4000); return; }
    buildMap(data);
  });
  function buildMap(data) {
    const playR = Math.max(18, ...cps.map(c => Math.hypot(c.x, c.z) + 8));
    const P = g => g.map(([la, lo]) => { const p = toXZ(la, lo); return [p.x, p.z]; });
    const roadsO = [], roadsF = [], paths = [], parks = [], water = [], blds = [], pitches = [];
    for (const e of data) {
      const t = e.t, pts = P(e.g), closed = e.g.length > 3 && e.g[0][0] === e.g[e.g.length - 1][0] && e.g[0][1] === e.g[e.g.length - 1][1];
      if (t.highway && ROADW[t.highway]) {
        const w = ROADW[t.highway];
        if (w <= 2.6) paths.push(...stripGeo(pts, w, 0.05));
        else { roadsO.push(...stripGeo(pts, w + 1.6, 0.03)); roadsF.push(...stripGeo(pts, w, 0.06)); }
      } else if (t.building && closed) {
        const lv = parseFloat(t['building:levels']) || 0, h = parseFloat(t.height) || (lv ? lv * 3.2 : 7 + (Math.abs(pts[0][0] * 7 + pts[0][1] * 3) % 6));
        // nhà thấp kiểu hoạt hình; nhà nằm trong khu chơi (gần các linh vật) chỉ còn nền phẳng để không che
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cz = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        const inPlay = Math.hypot(cx, cz) < playR || pts.some(([x, z]) => Math.hypot(x, z) < playR * 0.8);
        const dh = inPlay ? 0.4 : Math.max(1.8, Math.min(6, h * 0.35));
        try { const g = new THREE.ExtrudeGeometry(shapeOf(pts.slice(0, -1)), { depth: dh, bevelEnabled: false }); g.rotateX(-Math.PI / 2); blds.push(g.toNonIndexed ? g : g); } catch { }
      } else if (closed && (t.natural === 'water')) { const g = new THREE.ShapeGeometry(shapeOf(pts.slice(0, -1))); g.rotateX(-Math.PI / 2); g.translate(0, 0.025, 0); water.push(g); }
      else if (t.waterway) water.push(...stripGeo(pts, t.waterway === 'river' ? 30 : 10, 0.025));
      else if (closed && (t.leisure === 'pitch' || t.leisure === 'stadium')) { const g = new THREE.ShapeGeometry(shapeOf(pts.slice(0, -1))); g.rotateX(-Math.PI / 2); g.translate(0, 0.02, 0); pitches.push(g); }
      else if (closed) { const g = new THREE.ShapeGeometry(shapeOf(pts.slice(0, -1))); g.rotateX(-Math.PI / 2); g.translate(0, 0.015, 0); parks.push(g); }
    }
    const put = (arr, mat) => { if (!arr.length) return; const clean = arr.map(g => { const n = g.index ? g.toNonIndexed() : g; for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal') n.deleteAttribute(k); if (!n.attributes.normal) n.computeVertexNormals(); return n; }); const m = new THREE.Mesh(mergeGeometries(clean), mat); scene.add(m); return m; };
    put(parks, toon('#79cf6e'));
    put(pitches, toon('#5fbf73'));
    put(water, toon('#6ec9f2'));
    put(roadsO, toon('#6fbfae'));
    put(roadsF, toon('#fffbe3'));
    put(paths, toon('#f3e7c4'));
    const b = put(blds, toon('#e6defa', { transparent: true, opacity: 0.92 }));
    if (b) { const edges = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry, 30), new THREE.LineBasicMaterial({ color: '#b7a9de' })); scene.add(edges); }
    // vài cây xanh trang trí ở công viên
  }

  // ---- linh vật tại các điểm ----
  const items = cps.map(cp => {
    const g = new THREE.Group(); g.position.set(cp.x, 0, cp.z); scene.add(g);
    const m = mascot(cp.icon); m.scale.setScalar(2.2); g.add(m);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.975, 1, 64), new THREE.MeshBasicMaterial({ color: cp.color || '#fff', transparent: true, opacity: 0.5, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.08; g.add(ring);
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 3.2, 8), new THREE.MeshBasicMaterial({ visible: false })); pick.position.y = 1.6; pick.userData.cp = cp; g.add(pick);
    const badge = new THREE.Mesh(new THREE.CircleGeometry(0.35, 20), new THREE.MeshBasicMaterial({ color: '#2ecc71', depthTest: false })); badge.position.y = 3.3; badge.visible = false; badge.renderOrder = 5; g.add(badge);
    return { cp, g, m, ring, pick, badge };
  });
  // ---- người chơi ----
  let me = null, meOpt = null;
  function setAvatar(opt) { if (me) scene.remove(me.g); meOpt = opt; const g = new THREE.Group(); const a = avatar(opt); a.scale.setScalar(1.6); g.add(a); scene.add(g); me = { g, a, ph: 0, last: null, face: 0 }; buildCone(); }
  let cone;
  function buildCone() {
    const cc = document.createElement('canvas'); cc.width = cc.height = 256; const x = cc.getContext('2d'), gr = x.createRadialGradient(128, 128, 6, 128, 128, 128);
    gr.addColorStop(0, 'rgba(42,127,208,.75)'); gr.addColorStop(1, 'rgba(42,127,208,0)'); x.fillStyle = gr; x.beginPath(); x.moveTo(128, 128); x.arc(128, 128, 128, -Math.PI / 2 - 0.6, -Math.PI / 2 + 0.6); x.closePath(); x.fill();
    const t = new THREE.CanvasTexture(cc); t.colorSpace = THREE.SRGBColorSpace;
    cone = new THREE.Group(); const p = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
    p.rotation.x = -Math.PI / 2; p.position.y = 0.09; cone.add(p); me.g.add(cone);
    const zone = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5, depthWrite: false }));
    zone.rotation.x = -Math.PI / 2; zone.position.y = 0.07; me.g.add(zone); me.zone = zone;
  }

  // ---- chạm vào linh vật ----
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8) return;
    const r = renderer.domElement.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(items.map(i => i.pick))[0];
    if (hit) { onTapCp(hit.object.userData.cp); return; }
    const gp = new THREE.Vector3(); if (onTapGround && ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), gp)) onTapGround(gp.x, gp.z);
  });

  // ---- vòng lặp ----
  let aim = null, active = true, prevT = performance.now(), zoomFar = false;
  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime(), now = performance.now(), dt = Math.min((now - prevT) / 1000, 0.1); prevT = now;
    const st = getState();
    if (me && st.pos) {
      const p = st.pos, prev = me.g.position.clone();
      me.g.position.set(p.x, 0, p.z);
      const d = new THREE.Vector3().subVectors(me.g.position, prev); d.y = 0;
      controls.target.add(d); camera.position.add(d);
      const sp = d.length() / Math.max(dt, 1e-3);
      const amt = Math.min(1, sp / 1.2); me.walkAmt = (me.walkAmt || 0) + (amt - (me.walkAmt || 0)) * Math.min(1, dt * 6);
      me.ph += dt * (6 + sp * 2) * (me.walkAmt > 0.05 ? 1 : 0);
      me.a.userData.walk(me.ph, me.walkAmt);
      let face = me.face;
      if (sp > 0.3) face = Math.atan2(d.x, d.z); else if (st.heading != null) face = Math.atan2(Math.sin(st.heading * Math.PI / 180), -Math.cos(st.heading * Math.PI / 180));
      const df = Math.atan2(Math.sin(face - me.face), Math.cos(face - me.face)); me.face += df * Math.min(1, dt * 8); me.a.rotation.y = me.face;
      if (cone) { cone.visible = st.heading != null; if (st.heading != null) cone.rotation.y = -st.heading * Math.PI / 180; }
      if (me.zone) { me.zone.scale.setScalar(st.radius || 5); }
    }
    for (const it of items) {
      const got = st.caught && st.caught[it.cp.id];
      it.m.userData.anim(t); it.badge.visible = !!got; it.m.visible = true;
      it.ring.scale.setScalar(st.radius || 5); it.ring.material.opacity = got ? 0.15 : 0.45;
      if (got !== it.got) { it.got = got; it.m.traverse(o => { if (o.material && o.material.color) { o.material.transparent = !!got; o.material.opacity = got ? 0.45 : 1; } }); }
      const v = camera.position.clone().sub(it.g.position); it.m.rotation.y = Math.atan2(v.x, v.z);
      it.badge.lookAt(camera.position);
    }
    // xoay camera theo hướng đặt trước
    const want = st.hdgUp && st.heading != null ? st.heading : aim;
    if (want != null) {
      const off = camera.position.clone().sub(controls.target), cur = (Math.atan2(-off.x, off.z) * 180 / Math.PI + 360) % 360;
      const dA = ((want - cur + 540) % 360) - 180;
      off.applyAxisAngle(new THREE.Vector3(0, 1, 0), -dA * (1 - Math.pow(0.004, dt)) * Math.PI / 180);
      camera.position.copy(controls.target).add(off);
      if (!st.hdgUp && Math.abs(dA) < 0.5) aim = null;
    }
    controls.update();
    renderer.render(scene, camera);
    onFrame && onFrame();
    if (active) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  const api = {
    setAvatar,
    upAz() { const f = controls.target.clone().sub(camera.position); return (Math.atan2(f.x, -f.z) * 180 / Math.PI + 360) % 360; },
    setAim(a) { aim = a; },
    toggleZoom() { zoomFar = !zoomFar; const off = camera.position.clone().sub(controls.target).setLength(zoomFar ? 70 : 30); camera.position.copy(controls.target).add(off); return zoomFar; },
    resize() { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix(); },
    setActive(v) { if (v && !active) { active = true; prevT = performance.now(); requestAnimationFrame(frame); } active = v; },
    controls,
  };
  addEventListener('resize', api.resize);
  return api;
}
