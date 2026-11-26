// Bố trí sự kiện kéo thả: sân khấu, lều, gian hàng, ghế…
// Kéo để di chuyển · Q/E hoặc nút ⟲ ⟳ để xoay 15° · D nhân bản · Delete xóa.

const LS_KEY = 'nvhtn-brvt-layout-v1';

export function initEvents({ THREE, scene, camera, controls, renderer, CSS2DObject, host, isBusy }) {
  const M = (c, e = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, ...e });
  const mat = {
    stage: M(0x2b2d33), skirt: M(0x111214), led: M(0x1b3d8f, { emissive: 0x0d2a7a, emissiveIntensity: 0.6 }),
    truss: M(0xb8bcc2, { metalness: 0.6, roughness: 0.4 }), tent: M(0xf7f7f2), tentRed: M(0xd8343b), leg: M(0x9aa0a6, { metalness: 0.5 }),
    booth: M(0xffffff), boothTop: M(0x1f8f8a), counter: M(0xe9e3d6), chair: M(0xe8e8e8), chairRed: M(0xc8202a),
    table: M(0xffffff), cloth: M(0x1e5bb8), carpet: M(0xa3262d), speaker: M(0x161616), fence: M(0xf2b51c),
  };
  const add = (g, geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; g.add(o); return o; };
  const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const fm = v => String(+(+v).toFixed(1)).replace('.', ',');

  // ---------- thư viện vật thể (kích thước mét) ----------
  const LIB = {
    stage: { name: 'Sân khấu', label: p => `Sân khấu ${fm(p.w)}×${fm(p.d)} m`, params: { w: ['Rộng', 12, 3, 40], d: ['Sâu', 8, 2, 20], h: ['Cao sàn', 1.2, 0.3, 2.5] }, build(g, p) {
      const { w, d, h } = p;
      add(g, B(w, h, d), mat.stage, 0, h / 2, 0);
      add(g, B(w + 0.05, h - 0.1, 0.05), mat.skirt, 0, (h - 0.1) / 2, d / 2 + 0.01);
      const lw = Math.max(2, w - 2), lh = Math.min(4.5, Math.max(2, w * 0.38));
      add(g, B(lw, lh, 0.3), mat.led, 0, h + 0.3 + lh / 2, -d / 2 + 0.4);
      [-w / 2, w / 2].forEach(x => add(g, B(0.4, h + lh + 1.3, 0.4), mat.truss, x, (h + lh + 1.3) / 2, -d / 2 + 0.4));
      add(g, B(w + 0.4, 0.4, 0.4), mat.truss, 0, h + lh + 1.3, -d / 2 + 0.4);
      const n = Math.max(1, Math.round(h / 0.3)), sh = h / n;
      for (let i = 0; i < n; i++) add(g, B(Math.min(2, w * 0.3), sh, 0.35), mat.stage, 0, sh * (i + 0.5), d / 2 + 0.35 * (n - i) - 0.17);
      [-w / 2 - 1, w / 2 + 1].forEach(x => add(g, B(0.8, 2.6, 0.8), mat.speaker, x, 1.3, d / 4));
    } },
    led: { name: 'Màn LED', label: p => `Màn LED ${fm(p.w)}×${fm(p.h)} m`, params: { w: ['Rộng', 6, 1, 20], h: ['Cao màn', 3.5, 1, 8] }, depth: 1.5, build(g, p) {
      const { w, h } = p;
      add(g, B(w, h, 0.25), mat.led, 0, 1.5 + h / 2, 0);
      [-w / 2 - 0.1, w / 2 + 0.1].forEach(x => add(g, B(0.3, h + 1.5, 0.3), mat.truss, x, (h + 1.5) / 2, 0));
      add(g, B(w + 0.4, 0.3, 1.5), mat.truss, 0, 0.15, 0);
    } },
    tent3: { name: 'Lều 3×3 m', w: 3, d: 3, build(g) {
      [[-1.45, -1.45], [1.45, -1.45], [-1.45, 1.45], [1.45, 1.45]].forEach(([x, z]) => add(g, B(0.08, 2.4, 0.08), mat.leg, x, 1.2, z));
      const r = add(g, new THREE.ConeGeometry(2.15, 1, 4), mat.tent, 0, 2.9, 0); r.rotation.y = Math.PI / 4;
      add(g, B(3, 0.25, 3), mat.tentRed, 0, 2.3, 0);
    } },
    tent6: { name: 'Nhà bạt', label: p => `Nhà bạt ${fm(p.w)}×${fm(p.d)} m`, params: { w: ['Rộng', 6, 3, 30], d: ['Sâu', 6, 3, 30] }, build(g, p) {
      const { w, d } = p, nx = Math.max(1, Math.ceil(w / 3)), nz = Math.max(1, Math.ceil(d / 3));
      for (let i = 0; i <= nx; i++) for (const z of [-d / 2 + 0.05, d / 2 - 0.05]) add(g, B(0.1, 3, 0.1), mat.leg, -w / 2 + 0.05 + i * (w - 0.1) / nx, 1.5, z);
      for (let j = 1; j < nz; j++) for (const x of [-w / 2 + 0.05, w / 2 - 0.05]) add(g, B(0.1, 3, 0.1), mat.leg, x, 1.5, -d / 2 + 0.05 + j * (d - 0.1) / nz);
      add(g, B(w, 0.3, d), mat.tent, 0, 2.95, 0);
      const r = add(g, new THREE.ConeGeometry(Math.SQRT1_2, 1, 4), mat.tent, 0, 3.1 + Math.min(w, d) * 0.15, 0);
      r.rotation.y = Math.PI / 4; r.scale.set(w, Math.min(w, d) * 0.3, d);
    } },
    booth: { name: 'Gian hàng 3×2 m', w: 3, d: 2, build(g) {
      add(g, B(3, 2.4, 0.06), mat.booth, 0, 1.2, -0.97);
      [-1.47, 1.47].forEach(x => add(g, B(0.06, 2.4, 2), mat.booth, x, 1.2, 0));
      add(g, B(3, 0.5, 2), mat.boothTop, 0, 2.65, 0);
      add(g, B(2.8, 1, 0.5), mat.counter, 0, 0.5, 0.7);
    } },
    chairRow: { name: 'Hàng 10 ghế', w: 5.5, d: 0.6, chairs: 10, build(g) { chairs(g, 10, 1); } },
    chairBlock: { name: 'Khối 100 ghế (10×10)', w: 5.5, d: 9.6, chairs: 100, build(g) { chairs(g, 10, 10); } },
    table: { name: 'Bàn tiếp đón 2×0,8 m', w: 2, d: 0.8, build(g) {
      add(g, B(2, 0.05, 0.8), mat.table, 0, 0.75, 0);
      add(g, B(2, 0.7, 0.02), mat.cloth, 0, 0.4, 0.4);
      [[-0.9, -0.3], [0.9, -0.3], [-0.9, 0.3], [0.9, 0.3]].forEach(([x, z]) => add(g, B(0.04, 0.75, 0.04), mat.leg, x, 0.375, z));
    } },
    carpet: { name: 'Thảm đỏ', label: p => `Thảm đỏ ${fm(p.w)}×${fm(p.d)} m`, params: { w: ['Rộng', 2, 1, 6], d: ['Dài', 12, 2, 40] }, build(g, p) { add(g, B(p.w, 0.03, p.d), mat.carpet, 0, 0.015, 0); } },
    barrier: { name: 'Hàng rào 2 m', w: 2, d: 0.4, build(g) {
      add(g, B(2, 0.06, 0.06), mat.fence, 0, 1, 0); add(g, B(2, 0.06, 0.06), mat.fence, 0, 0.5, 0);
      [-0.95, 0.95].forEach(x => add(g, B(0.06, 1.05, 0.4), mat.leg, x, 0.52, 0));
    } },
  };
  // ghế dùng InstancedMesh cho nhẹ
  function chairs(g, cols, rows) {
    const seat = new THREE.InstancedMesh(B(0.45, 0.06, 0.42), mat.chair, cols * rows);
    const back = new THREE.InstancedMesh(B(0.45, 0.45, 0.05), mat.chairRed, cols * rows);
    const legs = new THREE.InstancedMesh(B(0.42, 0.45, 0.38), mat.leg, cols * rows);
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
      const x = (c - (cols - 1) / 2) * 0.55, z = (r - (rows - 1) / 2) * 1.0;
      seat.setMatrixAt(i, m.makeTranslation(x, 0.45, z));
      back.setMatrixAt(i, m.makeTranslation(x, 0.72, z + 0.2)); // ghế quay mặt về -z (hướng khối nhà chính)
      legs.setMatrixAt(i, m.makeTranslation(x, 0.22, z));
    }
    [seat, back, legs].forEach(o => { o.castShadow = true; o.receiveShadow = true; g.add(o); });
    legs.material = new THREE.MeshStandardMaterial({ color: 0x777777, transparent: true, opacity: 0.35 });
  }

  // ---------- trạng thái ----------
  const pickMat = new THREE.MeshBasicMaterial({ visible: false });
  const layer = new THREE.Group(); layer.name = 'Bo_tri_su_kien'; scene.add(layer);
  const items = []; let selected = null, snap = true;

  const selBox = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 0.02, 1)), new THREE.LineBasicMaterial({ color: 0xff8a00 }));
  selBox.visible = false; scene.add(selBox);
  const selDiv = document.createElement('div'); selDiv.className = 'evlbl';
  const selLbl = new CSS2DObject(selDiv); selLbl.visible = false; scene.add(selLbl);

  // kích thước & tên của một vật thể (theo tham số nếu có)
  function defaults(def) { const p = {}; for (const [k, v] of Object.entries(def.params || {})) p[k] = v[1]; return p; }
  function sizeOf(g) { const def = LIB[g.userData.type], p = g.userData.p || {}; return { w: p.w ?? def.w, d: p.d ?? def.depth ?? def.d }; }
  function nameOf(g) { const def = LIB[g.userData.type]; return def.label ? def.label(g.userData.p) : def.name; }
  function fill(g) {
    const def = LIB[g.userData.type];
    while (g.children.length) g.remove(g.children[0]);
    def.build(g, g.userData.p);
    const { w, d } = sizeOf(g);
    const pick = new THREE.Mesh(B(w, 1.2, d), pickMat); pick.position.y = 0.6; pick.userData.pick = true; g.add(pick);
    g.traverse(o => { o.userData.owner = g; });
  }
  function create(type, x, z, rot = 0, id, params) {
    const def = LIB[type]; if (!def) return null;
    const g = new THREE.Group();
    g.position.set(x, 0, z); g.rotation.y = rot;
    g.userData = { type, id: id || Math.random().toString(36).slice(2, 9), p: { ...defaults(def), ...(params || {}) } };
    fill(g);
    layer.add(g); items.push(g); return g;
  }
  function remove(g) { layer.remove(g); items.splice(items.indexOf(g), 1); if (selected === g) select(null); changed(); }
  function select(g) {
    selected = g;
    selBox.visible = selLbl.visible = !!g;
    document.getElementById('evSelTools').style.display = g ? 'flex' : 'none';
    renderParams();
    if (g) updateSel();
  }
  function updateSel() {
    const { w, d } = sizeOf(selected);
    selBox.scale.set(w + 0.4, 1, d + 0.4);
    selBox.position.set(selected.position.x, 0.08, selected.position.z); selBox.rotation.y = selected.rotation.y;
    const deg = Math.round(((selected.rotation.y * 180 / Math.PI) % 360 + 360) % 360);
    selDiv.textContent = `${nameOf(selected)} · xoay ${deg}°`;
    selLbl.position.set(selected.position.x, 3.5, selected.position.z);
  }
  // ô chỉnh kích thước cho vật thể có tham số (sân khấu, màn LED, nhà bạt, thảm)
  function renderParams() {
    const box = document.getElementById('evParams');
    const def = selected && LIB[selected.userData.type];
    if (!def || !def.params) { box.style.display = 'none'; box.innerHTML = ''; return; }
    box.style.display = 'grid';
    box.innerHTML = `<div class="evptitle">Kích thước ${def.name.toLowerCase()} (m)</div>` + Object.entries(def.params).map(([k, [lab, , mn, mx]]) =>
      `<label>${lab}<input type="number" data-p="${k}" min="${mn}" max="${mx}" step="0.5" value="${selected.userData.p[k]}"></label>`).join('');
    box.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
      const [, , mn, mx] = def.params[inp.dataset.p];
      const v = parseFloat(inp.value.replace(',', '.'));
      if (!isFinite(v)) return;
      selected.userData.p[inp.dataset.p] = Math.min(mx, Math.max(mn, v));
      fill(selected); updateSel(); changed();
    }));
  }

  // ---------- giao diện ----------
  const panel = document.createElement('div'); panel.id = 'evPanel'; panel.className = 'panel';
  panel.innerHTML = `
    <div class="evhead"><b>🎪 Bố trí sự kiện</b><button id="evToggle" title="Thu gọn">–</button></div>
    <div id="evBody">
      <div class="evgrid">${Object.entries(LIB).map(([k, d]) => `<button data-add="${k}">${d.label ? d.label(defaults(d)) : d.name}${d.params ? ' ✎' : ''}</button>`).join('')}</div>
      <div id="evSelTools" class="row" style="display:none">
        <button id="evRotL" title="Xoay trái 15° (Q)">⟲ 15°</button><button id="evRotR" title="Xoay phải 15° (E)">⟳ 15°</button>
        <button id="evDup" title="Nhân bản (D)">⧉ Nhân bản</button><button id="evDel" title="Xóa (Delete)">🗑 Xóa</button>
      </div>
      <div id="evParams" style="display:none"></div>
      <div class="row">
        <button id="evSnap" class="on">Bắt lưới 0,5 m</button>
        <button id="evCopy">Sao chép bố cục</button><button id="evPaste">Dán bố cục</button><button id="evClear">Xóa hết</button>
      </div>
      <div id="evStats"></div>
      <div class="evhint">Bấm nút để thêm vào giữa màn hình · kéo vật thể để di chuyển · bấm chọn rồi xoay/nhân bản/xóa</div>
      <div id="evPasteBox" style="display:none"><textarea id="evTa" placeholder="Dán mã bố cục vào đây"></textarea><button id="evPasteOk">Áp dụng</button></div>
    </div>`;
  document.body.appendChild(panel);
  const $ = id => panel.querySelector('#' + id);
  $('evToggle').onclick = () => { const b = $('evBody'); const hide = b.style.display !== 'none'; b.style.display = hide ? 'none' : ''; $('evToggle').textContent = hide ? '+' : '–'; };

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function groundAt(cx, cy) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const p = new THREE.Vector3(); return ray.ray.intersectPlane(ground, p) ? p : null;
  }
  const sn = v => snap ? Math.round(v * 2) / 2 : v;
  // chỗ đặt vật thể mới: giữa màn hình nếu ở đó là mặt đất trống, nếu không thì giữa sân trung tâm
  function spawnPoint(def) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(0, 0); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(scene.children, true).find(h => h.object.visible && !h.object.userData.pick && !h.object.isLine && !h.object.isSprite);
    let p = hit && hit.point.y < 0.3 ? hit.point.clone() : new THREE.Vector3(-5.5, 0, 22);
    // tránh chồng lên vật thể vừa đặt
    const overlaps = () => items.some(g => { const q = sizeOf(g); return Math.abs(g.position.x - p.x) < (q.w + def.w) / 2 + 0.5 && Math.abs(g.position.z - p.z) < (q.d + def.d) / 2 + 0.5; });
    for (let k = 0; k < 80 && overlaps(); k++) p.x += 1;
    return p;
  }
  panel.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
    const dd = LIB[b.dataset.add], p = spawnPoint({ w: dd.params?.w?.[1] ?? dd.w, d: dd.params?.d?.[1] ?? dd.d ?? dd.depth ?? 1 });
    const g = create(b.dataset.add, sn(p.x), sn(p.z));
    select(g); changed();
  });
  const rot = s => { if (!selected) return; selected.rotation.y += s * Math.PI / 12; updateSel(); changed(); };
  $('evRotL').onclick = () => rot(1); $('evRotR').onclick = () => rot(-1);
  const dup = () => { if (!selected) return; const s = selected; const g = create(s.userData.type, s.position.x + 1, s.position.z + 1, s.rotation.y, null, { ...s.userData.p }); select(g); changed(); };
  $('evDup').onclick = dup; $('evDel').onclick = () => selected && remove(selected);
  $('evSnap').onclick = () => { snap = !snap; $('evSnap').classList.toggle('on', snap); };
  let clearArm = 0;
  $('evClear').onclick = () => {
    if (Date.now() - clearArm > 3000) { clearArm = Date.now(); $('evClear').textContent = 'Bấm lần nữa để xóa'; setTimeout(() => $('evClear').textContent = 'Xóa hết', 3000); return; }
    items.slice().forEach(g => layer.remove(g)); items.length = 0; select(null); changed(); $('evClear').textContent = 'Xóa hết';
  };
  $('evCopy').onclick = async () => {
    try { await navigator.clipboard.writeText(serialize()); flash($('evCopy'), 'Đã sao chép ✓'); }
    catch { $('evPasteBox').style.display = 'block'; $('evTa').value = serialize(); $('evTa').select(); }
  };
  $('evPaste').onclick = () => { const b = $('evPasteBox'); b.style.display = b.style.display === 'none' ? 'block' : 'none'; };
  $('evPasteOk').onclick = () => { try { load(JSON.parse($('evTa').value)); $('evPasteBox').style.display = 'none'; changed(); } catch { flash($('evPasteOk'), 'Mã không hợp lệ'); } };
  function flash(b, t) { const o = b.textContent; b.textContent = t; setTimeout(() => b.textContent = o, 1600); }

  // ---------- kéo thả ----------
  let drag = null;
  host.addEventListener('pointerdown', e => {
    if (e.target !== renderer.domElement || isBusy()) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(items, true)[0];
    if (!hit) { drag = { none: true, x: e.clientX, y: e.clientY }; return; }
    const g = hit.object.userData.owner; select(g);
    const p = groundAt(e.clientX, e.clientY);
    drag = { g, off: p ? new THREE.Vector3().subVectors(g.position, p) : new THREE.Vector3(), moved: false };
    controls.enabled = false;
  }, true);
  window.addEventListener('pointermove', e => {
    if (!drag || !drag.g) return;
    const p = groundAt(e.clientX, e.clientY); if (!p) return;
    drag.g.position.set(sn(p.x + drag.off.x), 0, sn(p.z + drag.off.z)); drag.moved = true; updateSel();
  });
  window.addEventListener('pointerup', e => {
    if (drag && drag.none && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 5 && e.target === renderer.domElement && !isBusy()) select(null);
    if (drag && drag.g) { controls.enabled = true; if (drag.moved) changed(); }
    drag = null;
  });
  window.addEventListener('keydown', e => {
    if (!selected || /INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return;
    if (e.key === 'q' || e.key === 'Q') rot(1);
    else if (e.key === 'e' || e.key === 'E') rot(-1);
    else if (e.key === 'd' || e.key === 'D') dup();
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(selected); }
    else if (e.key === 'Escape') select(null);
  });

  // ---------- thống kê + lưu ----------
  function serialize() {
    return JSON.stringify(items.map(g => { const o = { t: g.userData.type, x: +g.position.x.toFixed(2), z: +g.position.z.toFixed(2), r: +g.rotation.y.toFixed(4) }; if (LIB[g.userData.type].params) o.p = g.userData.p; return o; }));
  }
  function load(arr) {
    items.slice().forEach(g => layer.remove(g)); items.length = 0; select(null);
    (arr || []).forEach(o => create(o.t, o.x, o.z, o.r, null, o.p));
  }
  function changed() {
    const cnt = {}; let seats = 0;
    items.forEach(g => { const d = LIB[g.userData.type], n = nameOf(g); cnt[n] = (cnt[n] || 0) + 1; seats += d.chairs || 0; });
    const parts = Object.entries(cnt).map(([n, c]) => `${c} × ${n}`);
    $('evStats').innerHTML = items.length ? `<b>Tổng ${seats} ghế</b> · ${parts.join(' · ')}` : 'Chưa có vật thể nào.';
    try { localStorage.setItem(LS_KEY, serialize()); } catch { }
  }
  try { const saved = localStorage.getItem(LS_KEY); if (saved) load(JSON.parse(saved)); } catch { }
  changed();
  window.__ev = { items, select, project(x, z) { const v = new THREE.Vector3(x, 0.5, z).project(camera); const r = renderer.domElement.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; } };
  return { layer };
}
