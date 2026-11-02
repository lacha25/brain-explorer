import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { REGIONS, LEARNING_PATHS } from './data/regions.js';

const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const regionMap = new Map(REGIONS.map(r => [r.id, r]));
const groups = { cortex: 'CEREBRAL CORTEX', memory: 'MEMORY & EMOTION', deep: 'DEEP STRUCTURES', cerebellum: 'CEREBELLUM', brainstem: 'BRAINSTEM & MODULATION' };
const atlasMap = new Map();
REGIONS.forEach(r => (r.atlasLabels || []).forEach(name => atlasMap.set(name.toLowerCase(), r.id)));
function readLocal(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
const savedData = readLocal('neuro-atlas-saved', []);
const noteData = readLocal('neuro-atlas-notes', {});
const state = {
  selected: regionMap.has(location.hash.slice(1)) ? location.hash.slice(1) : 'prefrontal',
  tab: 'overview', mode: 'explore', deep: false, split: 0, connections: false,
  savedOnly: false, query: '', hemisphere: 'left', path: 0, step: 0,
  libraryOpen: false, detailsOpen: false, interacted: false,
  saved: new Set(Array.isArray(savedData) ? savedData.filter(id => regionMap.has(id)) : []),
  notes: noteData && typeof noteData === 'object' && !Array.isArray(noteData) ? noteData : {},
};
let renderer, scene, camera, controls, raycaster, frame = 0, surfaces = [], deepMeshes = [], markerMeshes = [];
let linkGroup, anatomyLoaded = false, hovered = null, pointerStart, boxCenter = new THREE.Vector3(0,-20,10);
const centroids = new Map();
const corticalIds = new Set([...atlasMap.values()]);
const sceneMeshes = [];

function setPanel(panel, open) {
  const isLibrary = panel === 'library';
  if (open && window.matchMedia('(max-width: 1000px)').matches) {
    const other = isLibrary ? 'details' : 'library';
    if (state[`${other}Open`]) setPanel(other, false);
  }
  state[`${panel}Open`] = open;
  $(isLibrary ? 'region-sidebar' : 'detail-panel').hidden = !open;
  document.querySelector('.workspace').classList.toggle(`${panel}-open`, open);
  const button = $(`toggle-${panel}`);
  button.classList.toggle('active', open);
  button.setAttribute('aria-expanded', String(open));
  if (!isLibrary && open) {
    state.interacted = true;
    $('selection-label').hidden = false;
    updateColors();
  }
  requestAnimationFrame(resize);
}

function toast(message) {
  $('toast').textContent = message; $('toast').hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => $('toast').hidden = true, 2600);
}
function persist() {
  try { localStorage.setItem('neuro-atlas-saved', JSON.stringify([...state.saved])); localStorage.setItem('neuro-atlas-notes', JSON.stringify(state.notes)); }
  catch { toast('Browser storage is unavailable. Export your notes to keep them.'); }
}
function renderLibrary() {
  const terms = state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = REGIONS.filter(r => (!state.savedOnly || state.saved.has(r.id)) && terms.every(t => [r.id,r.name,r.subtitle,r.overview,r.learning,...(r.roles || []),...(r.keywords || []),...(r.atlasLabels || [])].join(' ').toLowerCase().includes(t)));
  $('region-count').textContent = filtered.length;
  $('saved-count').textContent = state.saved.size;
  $('all-regions').classList.toggle('active', !state.savedOnly);
  $('saved-regions').classList.toggle('active', state.savedOnly);
  $('region-list').innerHTML = filtered.length ? Object.entries(groups).map(([key,name]) => {
    const items = filtered.filter(r => r.group === key);
    return items.length ? `<section class="region-group"><h3 class="group-heading">${name}<span>${items.length}</span></h3>${items.map(r => `<button class="region-button ${r.id === state.selected ? 'active' : ''}" data-region="${r.id}" aria-pressed="${r.id === state.selected}"><span class="region-dot" style="--region-color:${r.color}"></span><span class="region-name">${escapeHTML(r.name)}</span><span class="region-arrow" aria-hidden="true">${state.saved.has(r.id) ? '★' : '›'}</span></button>`).join('')}</section>` : '';
  }).join('') : `<div class="empty-state"><strong>${state.savedOnly ? 'No saved regions yet' : 'No matching regions'}</strong><p>${state.savedOnly ? 'Use the star on a region to keep it here.' : 'Try “memory”, “vision”, or “reward”.'}</p></div>`;
}
function badge(status) {
  const cls = status === 'Supported' ? 'supported' : status === 'Hypothesis' ? 'hypothesis' : 'mixed';
  return `<span class="evidence-badge ${cls}">${escapeHTML(status)}</span>`;
}
function connectionChips(r) {
  return (r.connections || []).filter(id => regionMap.has(id)).map(id => `<button class="connection-chip" data-region="${id}"><i style="background:${regionMap.get(id).color}"></i>${escapeHTML(regionMap.get(id).name)}<span>↗</span></button>`).join('');
}
function renderDetail() {
  const r = regionMap.get(state.selected);
  document.documentElement.style.setProperty('--selected-color', r.color);
  $('detail-group').textContent = groups[r.group] || r.group;
  $('detail-title').textContent = r.name;
  $('detail-subtitle').textContent = r.subtitle;
  $('selection-name').textContent = r.name;
  $('role-chips').innerHTML = r.roles.map(x => `<span>${escapeHTML(x)}</span>`).join('');
  $('save-region').textContent = state.saved.has(r.id) ? '★' : '☆';
  $('save-region').setAttribute('aria-pressed', state.saved.has(r.id));
  $('save-region').setAttribute('aria-label', state.saved.has(r.id) ? 'Unsave region' : 'Save region');
  $('save-region').title = state.saved.has(r.id) ? 'Unsave region' : 'Save region';
  ['overview','learning','evidence'].forEach(tab => { $(`tab-${tab}`).classList.toggle('active',state.tab === tab); $(`tab-${tab}`).setAttribute('aria-selected',state.tab === tab); $(`tab-${tab}`).tabIndex = state.tab === tab ? 0 : -1; });
  $('detail-content').setAttribute('aria-labelledby',`tab-${state.tab}`);
  const methods = (r.mechanisms || []).map(m => `<article class="mechanism-card"><div class="mechanism-heading"><h4>${escapeHTML(m.name)}</h4>${badge(m.status)}</div><p class="mechanism-text">${escapeHTML(m.text)}</p></article>`).join('');
  const sources = `<ol class="source-list">${(r.sources || []).map((s,i) => `<li><a class="source-link" href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer"><span class="source-number">${String(i+1).padStart(2,'0')}</span><span class="source-text">${escapeHTML(s.title)}</span><span class="source-arrow">↗</span></a></li>`).join('')}</ol>`;
  let content = '';
  if (state.tab === 'overview') content = `<section class="detail-section"><div class="section-label">WHAT IT CONTRIBUTES</div><p class="overview-text">${escapeHTML(r.overview)}</p></section><section class="learning-callout"><span class="callout-icon">↗</span><div><div class="section-label">ITS ROLE IN LEARNING</div><p>${escapeHTML(r.learning)}</p><button class="text-button" data-tab="learning">Explore the mechanisms →</button></div></section><section class="detail-section"><div class="section-label">WORKS WITH</div><div class="connection-list">${connectionChips(r)}</div><p class="source-note">Selected functional relationships; not a complete connectivity map.</p></section>`;
  if (state.tab === 'learning') content = `<section class="detail-section"><div class="section-label">HOW EXPERIENCE MAY CHANGE THIS SYSTEM</div><p class="overview-text">${escapeHTML(r.learning)}</p></section>${methods}<section class="detail-section"><div class="section-label">QUESTIONS STILL OPEN</div><ul class="question-list">${(r.questions || []).map(q => `<li>${escapeHTML(q)}</li>`).join('')}</ul></section>`;
  if (state.tab === 'evidence') content = `<section class="detail-section"><div class="section-label">FINDINGS & INTERPRETATIONS</div><p class="source-note">Read each claim in the context of its method, species, and task. The labels below are concise editorial assessments, not a systematic review.</p></section>${methods}<section class="detail-section"><div class="section-label">READ THE SOURCE MATERIAL</div>${sources}</section>`;
  content += `<section class="detail-section personal-note"><label class="note-label" for="region-note">YOUR RESEARCH NOTES <span>Saved locally</span></label><textarea id="region-note" rows="3" placeholder="A question, connection, or paper to follow up…"></textarea></section>`;
  $('detail-content').innerHTML = content;
  $('region-note').value = typeof state.notes[r.id] === 'string' ? state.notes[r.id] : '';
  $('region-note').addEventListener('input', e => { state.notes[state.selected] = e.target.value; persist(); });
  updateGeometryCaption();
}
function setTab(tab) { state.tab = tab; renderDetail(); $('detail-content').scrollTop = 0; }
function selectRegion(id, options = {}) {
  if (!regionMap.has(id)) return;
  state.selected = id;
  if (['left','right'].includes(options.hemisphere)) state.hemisphere = options.hemisphere;
  if (!options.fromCanvas) setDeep(!corticalIds.has(id), false);
  else if (!corticalIds.has(id)) setDeep(true, false);
  if (options.updateHash !== false) history.replaceState(null, '', `#${id}`);
  renderLibrary(); renderDetail(); updateColors(); drawConnections();
  if (options.reveal !== false) setPanel('details', true);
  if (options.fromCanvas && state.libraryOpen) { const button = $('region-list').querySelector(`[data-region="${id}"]`); button?.scrollIntoView({block:'nearest'}); }
  if (options.focus) focusCamera(id);
}
function setDeep(value, update = true) {
  state.deep = value;
  $('surface-mode').classList.toggle('active',!value); $('deep-mode').classList.toggle('active',value);
  if (update) { updateColors(); updateGeometryCaption(); }
}
function renderJourney() {
  const path = LEARNING_PATHS[state.path];
  $('path-description').textContent = path.subtitle;
  $('path-description').title = path.description;
  $('path-steps').innerHTML = path.steps.map((s,i) => `<button class="path-step ${i === state.step ? 'active' : ''}" data-step="${i}" aria-pressed="${i === state.step}"><span class="path-step-index">${String(i+1).padStart(2,'0')}</span><span class="path-step-title">${escapeHTML(s.title)}</span></button>`).join('') + `<p class="path-step-text">${escapeHTML(path.steps[state.step].text)}</p>`;
}
function setMode(mode) {
  state.mode = mode;
  $('explore-mode').classList.toggle('active',mode === 'explore'); $('learn-mode').classList.toggle('active',mode === 'learn');
  $('learning-panel').hidden = mode !== 'learn';
  $('canvas-title').textContent = mode === 'learn' ? 'How experience becomes learning.' : 'A brain. Many ways to learn.';
  $('canvas-subtitle').textContent = mode === 'learn' ? 'Follow interacting systems, from new information to changed behavior.' : 'Select a region to explore its role in the bigger picture.';
  if (mode === 'learn') { renderJourney(); selectRegion(LEARNING_PATHS[state.path].steps[state.step].regionId); setTab('learning'); }
  requestAnimationFrame(resize);
}

function updateGeometryCaption() {
  const id = state.selected;
  const isMarker = markerMeshes.some(m => m.userData.regionId === id);
  const note = isMarker ? 'Schematic locator · not an anatomical boundary' : corticalIds.has(id) ? 'fsaverage5 · Desikan–Killiany anatomical parcels' : 'fsaverage · segmented deep anatomy';
  $('geometry-caption').textContent = state.connections ? 'Conceptual relationships · not fiber tracts' : note;
}
function hemisphereOffset(side) { return side === 'left' ? -state.split / 2 : side === 'right' ? state.split / 2 : 0; }
function addCentroid(id, side, position) {
  const key = `${id}:${side}`;
  if (!centroids.has(key)) centroids.set(key, {sum: new THREE.Vector3(), count: 0});
  const item = centroids.get(key); item.sum.add(position); item.count++;
}
function getCenter(id, side = state.hemisphere) {
  let actualSide = side;
  let item = centroids.get(`${id}:${side}`);
  if (!item) { actualSide = 'midline'; item = centroids.get(`${id}:midline`); }
  if (!item) return null;
  return item.sum.clone().divideScalar(item.count).add(new THREE.Vector3(hemisphereOffset(actualSide),0,0));
}
function makeGeometry(data) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.positions,3));
  geometry.setIndex(data.indices); geometry.computeVertexNormals();
  return geometry;
}
function atlasLabel(data, index) {
  const value = data.labels[index];
  return typeof value === 'string' ? value : data.labelNames[value] || 'unknown';
}
function makeSurface(data, side) {
  const geometry = makeGeometry(data);
  const count = data.positions.length / 3;
  const ids = new Array(count);
  for (let i=0;i<count;i++) {
    const label = atlasLabel(data,i).toLowerCase().replace(/^(ctx-)?(lh|rh)[-_]/,'');
    ids[i] = atlasMap.get(label) || null;
    if (ids[i]) addCentroid(ids[i],side,new THREE.Vector3(...data.positions.slice(i*3,i*3+3)));
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(count*3),3));
  const material = new THREE.MeshPhongMaterial({vertexColors:true,shininess:22,specular:0x292f2e,side:THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry,material);
  mesh.userData = {side,ids,sulc:data.sulc || [],type:'surface'};
  scene.add(mesh); surfaces.push(mesh); sceneMeshes.push(mesh);
}
function makeDeep(data) {
  const id = ['caudate','putamen'].includes(data.id) ? 'striatum' : data.id;
  if (!regionMap.has(id)) return;
  const geometry = makeGeometry(data);
  const side = data.hemisphere || 'midline';
  const material = new THREE.MeshPhongMaterial({color:regionMap.get(id).color,shininess:28,side:THREE.DoubleSide});
  const mesh = new THREE.Mesh(geometry,material);
  mesh.userData = {regionId:id,side,type:'deep'};
  for(let i=0;i<data.positions.length;i+=3) addCentroid(id,side,new THREE.Vector3(...data.positions.slice(i,i+3)));
  scene.add(mesh); deepMeshes.push(mesh); sceneMeshes.push(mesh);
}
function makeMarkers() {
  // Approximate reference-space locators only. These are deliberately NOT segmented boundaries.
  const definitions = [
    {id:'hypothalamus',points:[[-4,-4,-13],[4,-4,-13]],radius:3.3},
    {id:'basal-forebrain',points:[[-12,3,-13],[12,3,-13]],radius:3.3},
    {id:'dopamine-midbrain',points:[[-7,-21,-20],[7,-21,-20]],radius:3.2},
    {id:'locus-coeruleus',points:[[-5,-33,-27],[5,-33,-27]],radius:2.6},
    {id:'raphe',points:[[0,-26,-30]],radius:3.2},
  ];
  definitions.forEach(d => { if (!regionMap.has(d.id)) return; d.points.forEach(p => {
    const side = p[0]<0 ? 'left' : p[0]>0 ? 'right' : 'midline';
    const material = new THREE.MeshPhongMaterial({color:regionMap.get(d.id).color,emissive:regionMap.get(d.id).color,emissiveIntensity:.15,transparent:true,opacity:.85});
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(d.radius,0),material);
    mesh.position.set(...p); mesh.userData = {regionId:d.id,side,type:'marker',baseX:p[0]};
    addCentroid(d.id,side,new THREE.Vector3(...p));
    scene.add(mesh); markerMeshes.push(mesh); sceneMeshes.push(mesh);
  }); });
}
function updateColors() {
  if (!anatomyLoaded) return;
  const selected = regionMap.get(state.selected);
  const related = new Set(state.connections ? selected.connections : []);
  const palette = new Map(REGIONS.map(r => [r.id,new THREE.Color(r.color)]));
  const neutral = new THREE.Color('#d3d9d5');
  const lightNeutral = new THREE.Color('#e2e6e0');
  surfaces.forEach(mesh => {
    const attr = mesh.geometry.getAttribute('color');
    for (let i=0;i<attr.count;i++) {
      const id = mesh.userData.ids[i];
      const color = (palette.get(id) || neutral).clone();
      const selectedHere = state.interacted && id === state.selected;
      if (!selectedHere && id !== hovered) color.lerp(lightNeutral, related.has(id) ? .23 : .63);
      const sulc = Number(mesh.userData.sulc[i] || 0);
      const shade = Math.max(.58,Math.min(1.05,.88 - sulc*.12));
      color.multiplyScalar(selectedHere ? Math.max(.73,shade) : shade);
      attr.setXYZ(i,color.r,color.g,color.b);
    }
    attr.needsUpdate = true;
    const transparent = state.deep || state.connections;
    const side = state.deep ? THREE.FrontSide : THREE.DoubleSide;
    if (mesh.material.transparent !== transparent || mesh.material.side !== side) mesh.material.needsUpdate = true;
    mesh.material.transparent = transparent;
    mesh.material.opacity = state.deep ? .09 : state.connections ? .24 : 1;
    mesh.material.depthWrite = !state.deep && !state.connections;
    mesh.material.side = side;
    mesh.position.x = hemisphereOffset(mesh.userData.side);
    mesh.renderOrder = state.deep ? 2 : 0;
  });
  deepMeshes.forEach(mesh => {
    const id = mesh.userData.regionId;
    const selectedHere = state.interacted && id === state.selected;
    mesh.visible = state.deep || state.connections || id === 'cerebellum' || id === 'brainstem';
    mesh.material.color.set(regionMap.get(id).color).lerp(lightNeutral,selectedHere || id === hovered ? 0 : related.has(id) ? .25 : .58);
    mesh.material.emissive.set(selectedHere ? regionMap.get(id).color : '#000000');
    mesh.material.emissiveIntensity = selectedHere ? .12 : 0;
    const transparent = state.deep && !selectedHere;
    if (mesh.material.transparent !== transparent) mesh.material.needsUpdate = true;
    mesh.material.transparent = transparent;
    mesh.material.opacity = selectedHere ? 1 : .35;
    mesh.material.depthWrite = !state.deep || selectedHere;
    mesh.position.x = hemisphereOffset(mesh.userData.side);
  });
  markerMeshes.forEach(mesh => {
    const selectedHere = mesh.userData.regionId === state.selected;
    mesh.visible = (state.deep || state.connections) && (selectedHere || related.has(mesh.userData.regionId));
    mesh.scale.setScalar(selectedHere ? 1.3 : 1);
    mesh.position.x = mesh.userData.baseX + hemisphereOffset(mesh.userData.side);
  });
  updateGeometryCaption();
}
function drawConnections() {
  if (!scene || !anatomyLoaded) return;
  if (linkGroup) {
    linkGroup.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
    scene.remove(linkGroup);
  }
  linkGroup = new THREE.Group(); scene.add(linkGroup);
  if (!state.connections) return;
  const origin = getCenter(state.selected);
  if (!origin) return;
  const r = regionMap.get(state.selected);
  (r.connections || []).forEach(id => {
    const end = getCenter(id); if (!end) return;
    const mid = origin.clone().lerp(end,.5).add(new THREE.Vector3(state.hemisphere === 'left' ? -15 : 15,0,18));
    const curve = new THREE.QuadraticBezierCurve3(origin,mid,end);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)),new THREE.LineDashedMaterial({color:r.color,transparent:true,opacity:.85,dashSize:2,gapSize:1.2,depthTest:false}));
    line.computeLineDistances(); line.renderOrder=10; linkGroup.add(line);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(1.7,12,8),new THREE.MeshBasicMaterial({color:regionMap.get(id).color,depthTest:false}));
    dot.position.copy(end); dot.renderOrder=11; linkGroup.add(dot);
  });
}
function resize() {
  if (!renderer) return;
  const bounds = $('viewport').getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  renderer.setSize(bounds.width,bounds.height,false);
  camera.aspect=bounds.width/bounds.height; camera.updateProjectionMatrix();
}
function resetCamera(view = 'left') {
  if (!camera) return;
  const offsets = {left:[-325,-30,90],right:[325,-30,90],top:[0,-30,355],front:[0,340,55]};
  const offset = new THREE.Vector3(...(offsets[view] || offsets.left));
  camera.position.copy(boxCenter).add(offset); controls.target.copy(boxCenter);
  state.hemisphere = view === 'right' ? 'right' : 'left'; controls.update(); drawConnections();
}
function focusCamera(id) {
  const target = getCenter(id);
  if (!target || !camera) return;
  controls.target.copy(target); controls.update();
}
function picked(event) {
  if (!anatomyLoaded) return null;
  const bounds = $('brain-canvas').getBoundingClientRect();
  const mouse = new THREE.Vector2((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);
  raycaster.setFromCamera(mouse,camera);
  const hits = raycaster.intersectObjects(sceneMeshes.filter(m => m.visible),false);
  let fallback = null;
  for(const hit of hits) {
    const data = hit.object.userData;
    if(data.type === 'surface') {
      const ids=[data.ids[hit.face.a],data.ids[hit.face.b],data.ids[hit.face.c]];
      const id=ids.find(x => x && ids.filter(y=>x===y).length>=2) || ids.find(Boolean);
      if (!id) continue;
      const result={id,side:data.side};
      if (!state.deep && !state.connections) return result;
      fallback ??= result;
    } else { return {id:data.regionId,side:data.side}; }
  }
  return fallback;
}
function pointerMove(event) {
  const result = picked(event);
  if (pointerStart && Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>4) { $('hover-label').hidden=true; return; }
  if (result && regionMap.has(result.id)) {
    const bounds = $('viewport').getBoundingClientRect();
    $('hover-label').hidden=false;
    $('hover-label').textContent=regionMap.get(result.id).name;
    $('hover-label').style.left=`${Math.min(event.clientX-bounds.left+14,bounds.width-200)}px`;
    $('hover-label').style.top=`${Math.max(10,event.clientY-bounds.top-38)}px`;
    $('brain-canvas').style.cursor='pointer';
    if(hovered!==result.id) {hovered=result.id; updateColors();}
  } else {
    $('hover-label').hidden=true; $('brain-canvas').style.cursor='grab';
    if(hovered) {hovered=null;updateColors();}
  }
}
async function initBrain() {
  try {
    renderer = new THREE.WebGLRenderer({canvas:$('brain-canvas'),antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setClearColor(0xf4f5f1,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(36,1,.1,2000); camera.up.set(0,0,1);
    controls = new OrbitControls(camera,$('brain-canvas'));
    controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=160;controls.maxDistance=650;controls.enablePan=true;controls.autoRotateSpeed=.35;
    scene.add(new THREE.AmbientLight(0xffffff,.85));
    const hemi = new THREE.HemisphereLight(0xffffff,0x8f9c98,1.1); hemi.up.set(0,0,1); scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff9eb,2.4); key.position.set(-180,150,260);scene.add(key);
    const fill=new THREE.DirectionalLight(0xdbe9ff,1.25);fill.position.set(200,-100,100);scene.add(fill);
    const rim=new THREE.DirectionalLight(0xffffff,.65);rim.position.set(0,-200,-60);scene.add(rim);
    raycaster = new THREE.Raycaster();
    const response = await fetch('./assets/brain.json'); if(!response.ok) throw new Error('Anatomical data could not be loaded.');
    const data=await response.json();
    makeSurface(data.left,'left');makeSurface(data.right,'right');
    (data.deep || []).forEach(makeDeep); makeMarkers();
    const box = new THREE.Box3(); surfaces.forEach(m=>box.expandByObject(m));box.getCenter(boxCenter); boxCenter.z-=8;
    anatomyLoaded=true;updateColors();drawConnections();resetCamera();resize();
    $('loading').hidden=true;
    const cameraButtons=document.createElement('div');cameraButtons.className='camera-presets';cameraButtons.setAttribute('aria-label','Camera presets');
    cameraButtons.innerHTML='<button data-view="left" title="Left lateral view">L</button><button data-view="right" title="Right lateral view">R</button><button data-view="top" title="Superior view">Top</button><button data-view="front" title="Anterior view">Front</button>';
    cameraButtons.addEventListener('click',e=>{const btn=e.target.closest('[data-view]');if(btn)resetCamera(btn.dataset.view);});$('viewport').append(cameraButtons);
    const observer=new ResizeObserver(resize);observer.observe($('viewport'));
    let lastOrientation='';
    function animate(){ frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);
      const delta=camera.position.clone().sub(controls.target);const axis=Math.max(Math.abs(delta.x),Math.abs(delta.y),Math.abs(delta.z));
      const orientation=axis===Math.abs(delta.z)?delta.z>0?'SUPERIOR VIEW':'INFERIOR VIEW':axis===Math.abs(delta.x)?delta.x<0?'LEFT · LATERAL':'RIGHT · LATERAL':delta.y>0?'ANTERIOR VIEW':'POSTERIOR VIEW';
      if(lastOrientation!==orientation){$('orientation-label').textContent=orientation;lastOrientation=orientation;}
    }
    animate();
    $('brain-canvas').addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
    $('brain-canvas').addEventListener('pointermove',pointerMove);
    $('brain-canvas').addEventListener('pointerup',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<5){const hit=picked(e);if(hit)selectRegion(hit.id,{hemisphere:hit.side,fromCanvas:true});}pointerStart=null;});
    $('brain-canvas').addEventListener('pointerleave',()=>{$('hover-label').hidden=true;pointerStart=null;if(hovered){hovered=null;updateColors();}});
    $('brain-canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);toast('The 3D graphics context was interrupted. Reload to restore the viewer.');});
  } catch(error) {
    $('loading').innerHTML=`<strong>3D view unavailable</strong><span>${escapeHTML(error.message)}</span><span>The region library and evidence panels are still available.</span>`;
    console.error(error);
  }
}

$('region-search').addEventListener('input',e=>{state.query=e.target.value;renderLibrary();});
$('toggle-library').addEventListener('click',()=>setPanel('library',!state.libraryOpen));
$('toggle-details').addEventListener('click',()=>setPanel('details',!state.detailsOpen));
$('close-library').addEventListener('click',()=>{setPanel('library',false);$('toggle-library').focus();});
$('close-details').addEventListener('click',()=>{setPanel('details',false);$('toggle-details').focus();});
window.matchMedia('(max-width: 1000px)').addEventListener('change',e=>{
  if(e.matches&&state.libraryOpen&&state.detailsOpen)setPanel('library',false);
});
$('all-regions').addEventListener('click',()=>{state.savedOnly=false;renderLibrary();});
$('saved-regions').addEventListener('click',()=>{state.savedOnly=true;renderLibrary();});
$('region-list').addEventListener('click',e=>{const b=e.target.closest('[data-region]');if(b)selectRegion(b.dataset.region);});
$('detail-content').addEventListener('click',e=>{const b=e.target.closest('[data-region]');if(b)selectRegion(b.dataset.region);const tab=e.target.closest('[data-tab]');if(tab)setTab(tab.dataset.tab);});
$('save-region').addEventListener('click',()=>{const id=state.selected;if(state.saved.has(id))state.saved.delete(id);else state.saved.add(id);persist();renderLibrary();renderDetail();});
['overview','learning','evidence'].forEach(tab=>$(`tab-${tab}`).addEventListener('click',()=>setTab(tab)));
document.querySelector('.detail-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=['overview','learning','evidence'];let i=tabs.indexOf(state.tab);i=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;setTab(tabs[i]);$(`tab-${tabs[i]}`).focus();});
$('explore-mode').addEventListener('click',()=>setMode('explore'));
$('learn-mode').addEventListener('click',()=>setMode('learn'));
$('surface-mode').addEventListener('click',()=>setDeep(false));
$('deep-mode').addEventListener('click',()=>setDeep(true));
$('split-range').addEventListener('input',e=>{state.split=Number(e.target.value);updateColors();drawConnections();});
$('connections-toggle').addEventListener('click',()=>{state.connections=!state.connections;$('connections-toggle').classList.toggle('active',state.connections);$('connections-toggle').setAttribute('aria-pressed',state.connections);updateColors();drawConnections();});
$('rotate-toggle').addEventListener('click',()=>{if(!controls)return;controls.autoRotate=!controls.autoRotate;$('rotate-toggle').classList.toggle('active',controls.autoRotate);$('rotate-toggle').setAttribute('aria-pressed',controls.autoRotate);});
$('reset-view').addEventListener('click',()=>{state.split=0;$('split-range').value=0;updateColors();resetCamera();});
$('path-select').innerHTML=LEARNING_PATHS.map((p,i)=>`<option value="${i}">${escapeHTML(p.title)}</option>`).join('');
$('path-select').addEventListener('change',e=>{state.path=Number(e.target.value);state.step=0;renderJourney();selectRegion(LEARNING_PATHS[state.path].steps[0].regionId);});
$('path-steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(!b)return;state.step=Number(b.dataset.step);renderJourney();selectRegion(LEARNING_PATHS[state.path].steps[state.step].regionId);});
function showAbout(){$('about-dialog').showModal();}
$('info-button').addEventListener('click',showAbout);$('anatomy-info').addEventListener('click',showAbout);$('close-dialog').addEventListener('click',()=>$('about-dialog').close());
$('about-dialog').addEventListener('click',e=>{if(e.target===$('about-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
$('export-notes').addEventListener('click',()=>{const content={application:'Neuro Atlas',exportedAt:new Date().toISOString(),savedRegions:[...state.saved].map(id=>({id,name:regionMap.get(id).name})),notes:state.notes};const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)],{type:'application/json'}));a.href=url;a.download='neuro-atlas-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);toast('Your notes have been exported.');});
document.addEventListener('keydown',e=>{
  if (e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('about-dialog').open) {e.preventDefault();setPanel('library',true);$('region-search').focus();}
  if (e.key==='Escape'&&!$('about-dialog').open) {
    const hadDetails=state.detailsOpen;
    if (state.detailsOpen) setPanel('details',false);
    if (state.libraryOpen) setPanel('library',false);
    $(hadDetails?'toggle-details':'toggle-library').focus();
  }
});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(regionMap.has(id))selectRegion(id,{updateHash:false});});
fetch('./assets/atlas-source.json').then(r=>r.json()).then(meta=>{
  $('about-geometry').textContent='The cortical surfaces are real fsaverage5 anatomy with Desikan–Killiany parcel labels. Deep structures and cerebellum use matching fsaverage segmentation meshes. Diamond markers for the hypothalamus, basal forebrain, dopamine midbrain, locus coeruleus, and raphe are approximate locators, not segmented anatomy. This is a reference brain, not an individual scan or a universal functional map.';
  const links=[{title:'Nilearn surface topology',url:'https://github.com/nilearn/nilearn/tree/main/nilearn/datasets/data/fsaverage5'},{title:'FreeSurfer anatomical labels',url:'https://surfer.nmr.mgh.harvard.edu/fswiki/CorticalParcellation'},{title:'MNE fsaverage dataset',url:'https://mne.tools/stable/generated/mne.datasets.fetch_fsaverage.html'}];
  $('atlas-attribution').innerHTML=`<div class="section-label">ANATOMICAL DATA & ATTRIBUTION</div>${links.map(l=>`<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.title} ↗</a>`).join('')}<a href="./assets/atlas-source.json" target="_blank" rel="noopener noreferrer">Full provenance & license notes ↗</a>`;
}).catch(()=>{});
$('selection-label').hidden=true;
renderLibrary();renderDetail();selectRegion(state.selected,{updateHash:false,reveal:false});initBrain();
