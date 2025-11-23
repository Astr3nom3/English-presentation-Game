/* ============================
   V2 SCRIPT (NeoTech + Detective using local avatars)
   ============================ */

/* ---------------- CONFIG ---------------- */
const NATIONALITIES = [
  {id:'terra', label:'Terran (Earth)'},
  {id:'aurelion', label:'Aurelian (Aurelia)'},
  {id:'kaldor', label:'Kaltorian (Kaldor)'},
  {id:'veshara', label:'Veshari (Vesha)'},
  {id:'zorvia', label:'Zorvian (Zorvia)'}
];

const RACES = [
  {id:'human', label:'Human'},
  {id:'aurelian', label:'Aurelian (avian)'},
  {id:'kaltorian', label:'Kaltorian (reptilian)'},
  {id:'vesharian', label:'Vesharian (energy being)'},
  {id:'zorvian', label:'Zorvian (insectoid)'},
  {id:'synth', label:'Synth (android)'}
];

const SEXES = ['Male','Female','Other'];

/* ---------------- HELPERS ---------------- */
function avatarPath(race, sex){ return `avatars/${race}_${sex.toLowerCase()}.png`; }
function flagPath(id){ return `flags/${id}.png`; }

function seededRandom(seed){
  let h=2166136261>>>0;
  for(let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
  return function(){
    h += 0x6D2B79F5;
    var t = Math.imul(h ^ h>>>15, 1 | h);
    t ^= t + Math.imul(t ^ t>>>7, 61 | t);
    return ((t ^ t>>>14) >>> 0)/4294967296;
  };
}
function generateFactions(planetId){
  const adjectives=['Nova','Crimson','Azure','Silver','Obsidian','Radiant','Iron','Solar','Lunar','Vanguard','Silent','Echo'];
  const nouns=['Guard','Consortium','Union','Syndicate','Collective','Order','Fleet','Guild','House','Conclave'];
  const rnd = seededRandom(planetId + '_f');
  const n = 2 + Math.floor(rnd()*4);
  const out=[];
  for(let i=0;i<n;i++) out.push(adjectives[Math.floor(rnd()*adjectives.length)] + ' ' + nouns[Math.floor(rnd()*nouns.length)]);
  return out;
}

/* ---------------- AUTH MINI-GAME ---------------- */
const overlayAuth = document.getElementById('overlay-auth');
const authSymbols = document.getElementById('auth-symbols');
const authMsg = document.getElementById('auth-msg');
const app = document.getElementById('app');

const alienSymbols = ['✦','☽','✧','✹','✶'];
let correctSymbol = alienSymbols[Math.floor(Math.random()*alienSymbols.length)];

function buildAuth(){
  authSymbols.innerHTML='';
  alienSymbols.forEach(s=>{
    const d=document.createElement('div');
    d.className='symbol-btn';
    d.textContent=s;
    d.onclick = ()=>{ handleAuthClick(s); };
    authSymbols.appendChild(d);
  });
  authMsg.textContent='';
}
function handleAuthClick(s){
  if(s === correctSymbol){
    authMsg.style.color='var(--good)';
    authMsg.textContent='Access Granted ✓';
    setTimeout(()=>{ overlayAuth.classList.remove('active'); overlayAuth.classList.add('hidden'); app.classList.remove('hidden'); renderCreator(); }, 700);
  } else {
    authMsg.style.color='var(--bad)';
    authMsg.textContent='Access Denied ✘';
  }
}
buildAuth();

/* ---------------- MAIN UI HOOKS ---------------- */
const main = document.getElementById('main');
document.getElementById('createMode').onclick = ()=>{ renderCreator(); };
document.getElementById('detectMode').onclick = ()=>{ renderDetectiveSimple(); };
document.getElementById('detectChallenge').onclick = ()=>{ renderDetectiveChallenge(); };
document.getElementById('randomAgent').onclick = ()=>{ generateRandomAgent(); };

/* ---------------- RENDER CREATOR ---------------- */
function renderCreator(){
  main.innerHTML = `
    <div class="panel">
      <div class="grid">
        <div>
          <label>Full name <input id="name" value="Nova Star"></label>
          <label>Role / Title <input id="role" value="Explorer"></label>
          <label>Birth date (fictional) <input id="dob" value="2124-07-08"></label>

          <label>Nationality (planet)
            <select id="nationality"><option value="">-- choose planet --</option></select>
          </label>

          <label>Faction
            <select id="faction" disabled><option>(select planet first)</option></select>
          </label>

          <label>Race
            <select id="race"></select>
          </label>

          <label>Sex
            <select id="sex"></select>
          </label>

          <div style="margin-top:12px;display:flex;gap:8px">
            <button id="generate" class="btn">Generate preview</button>
            <button id="download" class="btn btn-accent">Download PNG</button>
          </div>
        </div>

        <div>
          <div class="card" id="preview">
            <div class="meta">GALAXIA ID</div>
            <div style="display:flex;gap:14px;align-items:flex-start">
              <div class="photo" id="pvPhoto"></div>
              <div class="info">
                <div class="field-title">Name</div>
                <div class="field-value" id="pvName">Nova Star</div>
                <div style="height:6px"></div>
                <div class="field-title">Role</div>
                <div class="muted" id="pvRole">Explorer</div>
                <div style="height:10px"></div>
                <div class="field-title">DOB</div>
                <div class="muted" id="pvDob">2124-07-08</div>
                <div style="height:6px"></div>
                <div class="field-title">Sex</div>
                <div class="muted" id="pvSex">Other</div>
                <div style="height:6px"></div>
                <div class="field-title">Race</div>
                <div class="muted" id="pvRace">Human</div>
                <div style="height:6px"></div>
                <div class="field-title">Nationality <img id="pvFlag" class="flag" src=""></div>
                <div class="muted" id="pvNation">Terran (Earth)</div>
              </div>
            </div>
            <div class="pv-bottom" id="pvFaction">Faction: —</div>
          </div>
        </div>

      </div>
    </div>
  `;

  // populate selects
  const natSel = document.getElementById('nationality');
  NATIONALITIES.forEach(n => natSel.insertAdjacentHTML('beforeend', `<option value="${n.id}">${n.label}</option>`));
  const raceSel = document.getElementById('race');
  RACES.forEach(r => raceSel.insertAdjacentHTML('beforeend', `<option value="${r.id}">${r.label}</option>`));
  const sexSel = document.getElementById('sex');
  SEXES.forEach(s => sexSel.insertAdjacentHTML('beforeend', `<option value="${s}">${s}</option>`));

  // events
  document.getElementById('nationality').onchange = onNationalityChange;
  document.getElementById('generate').onclick = updatePreview;
  document.getElementById('download').onclick = downloadPNG;

  // initial preview
  updatePreview();
}

function onNationalityChange(){
  const nat = document.getElementById('nationality').value;
  const factionSel = document.getElementById('faction');
  factionSel.innerHTML = '';
  if(!nat){
    factionSel.disabled = true;
    factionSel.innerHTML = '<option>(select planet first)</option>';
  } else {
    const list = generateFactions(nat);
    list.forEach((f,i)=> factionSel.insertAdjacentHTML('beforeend', `<option value="${i}">${f}</option>`));
    factionSel.disabled = false;
    factionSel.selectedIndex = 0;
  }
  updatePreview();
}

function updatePreview(){
  const name = document.getElementById('name')?.value.trim() || 'Unnamed';
  const role = document.getElementById('role')?.value.trim() || '—';
  const dob = document.getElementById('dob')?.value.trim() || '—';
  const nat = document.getElementById('nationality')?.value || 'terra';
  const race = document.getElementById('race')?.value || 'human';
  const sex = document.getElementById('sex')?.value || 'Other';
  const factionIdx = document.getElementById('faction')?.value;

  document.getElementById('pvName').textContent = name;
  document.getElementById('pvRole').textContent = role;
  document.getElementById('pvDob').textContent = dob;
  document.getElementById('pvSex').textContent = sex;
  document.getElementById('pvRace').textContent = (RACES.find(r=>r.id===race)||{}).label || '';
  document.getElementById('pvNation').textContent = (NATIONALITIES.find(n=>n.id===nat)||{}).label || '';

  const factions = nat ? generateFactions(nat) : [];
  const factionText = (typeof factionIdx !== 'undefined' && factionIdx !== null && factions[factionIdx]) ? factions[factionIdx] : '—';
  document.getElementById('pvFaction').textContent = `Faction: ${factionText}`;

  // set flag image
  const flagEl = document.getElementById('pvFlag');
  const fpath = flagPath(nat);
  flagEl.src = fpath;
  flagEl.alt = nat + ' flag';
  flagEl.onerror = ()=>{ flagEl.style.display='none'; }

  // avatar
  const photoEl = document.getElementById('pvPhoto');
  const apath = avatarPath(race, sex);
  photoEl.innerHTML = `<img src="${apath}" alt="portrait" style="width:100%;height:100%;object-fit:cover">`;
}

/* ---------------- RANDOM AGENT ---------------- */
function generateRandomAgent(){
  const first = ["Nova","Orion","Zephyr","Kyra","Axis","Vega","Juno","Nyx","Solara","Talon"];
  const last = ["Starborn","Voidrunner","Eclipse","Stormbreaker","Skydancer","Cipher"];
  const name = first[Math.floor(Math.random()*first.length)] + " " + last[Math.floor(Math.random()*last.length)];
  document.getElementById('name').value = name;
  document.getElementById('role').value = ["Explorer","Pilot","Scientist","Hunter","Agent","Diplomat"][Math.floor(Math.random()*6)];
  document.getElementById('dob').value = (2000 + Math.floor(Math.random()*150)) + "-" + String(1+Math.floor(Math.random()*12)).padStart(2,'0') + "-" + String(1+Math.floor(Math.random()*28)).padStart(2,'0');
  const nat = NATIONALITIES[Math.floor(Math.random()*NATIONALITIES.length)].id;
  document.getElementById('nationality').value = nat;
  onNationalityChange();
  document.getElementById('race').value = RACES[Math.floor(Math.random()*RACES.length)].id;
  document.getElementById('sex').value = SEXES[Math.floor(Math.random()*SEXES.length)];
  updatePreview();
}

/* ---------------- PNG + SCAN ---------------- */
function downloadPNG(){
  const scan = document.getElementById('scan-overlay');
  scan.classList.add('active');

  setTimeout(()=>{
    const card = document.getElementById('preview');
    html2canvas(card, {backgroundColor:null, scale:2}).then(canvas=>{
      const a = document.createElement('a');
      a.download = 'galactic-id.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
      setTimeout(()=>scan.classList.remove('active'),600);
    }).catch(e=>{
      console.error('Export failed', e);
      setTimeout(()=>scan.classList.remove('active'),600);
      alert('Export failed — check console');
    });
  },500);
}

/* ---------------- DETECTIVE MODE (SIMPLE) ----------------
   Uses a small static set of cards that reference local avatars/flags.
   The "bad" card is flagged by property bad:true
*/
function renderDetectiveSimple(){
  main.innerHTML = `
    <div class="panel">
      <h2>Detective Mode — Find the fake ID</h2>
      <p class="muted">Click the card that looks inconsistent.</p>
      <div id="cards" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px"></div>
      <div style="margin-top:12px"><button id="back" class="btn btn-ghost">Back</button></div>
    </div>
  `;

  const cardsDiv = document.getElementById('cards');

  // small curated examples (paths use avatars/ and flags/)
  const examples = [
    {name:'Nova Star', role:'Explorer', dob:'2124-07-08', nat:'terra', race:'human', sex:'Female', bad:false},
    {name:'Ori Kellan', role:'Merchant', dob:'2118-03-22', nat:'aurelion', race:'aurelian', sex:'Male', bad:false},
    {name:'L0ra-9', role:'Pilot', dob:'2099-11-11', nat:'kaldor', race:'kaltorian', sex:'Other', bad:false},
    {name:'Max Storm', role:'Explorerrs', dob:'2130-02-05', nat:'veshara', race:'kaltorian', sex:'Male', bad:true} // deliberate error
  ];

  examples.sort(()=>Math.random()-0.5);
  examples.forEach(c=>{
    const container = document.createElement('div');
    container.className='det-card';
    container.style.cursor='pointer';
    container.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:72px;height:100px;overflow:hidden;border-radius:6px"><img src="${avatarPath(c.race, c.sex)}" style="width:100%;height:100%;object-fit:cover"></div>
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(c.name)}</div>
          <div class="muted">${escapeHtml(c.role)}</div>
          <div class="muted" style="margin-top:6px">DOB: ${escapeHtml(c.dob)}</div>
          <img src="${flagPath(c.nat)}" style="width:68px;height:46px;margin-top:8px;border-radius:6px">
        </div>
      </div>
    `;
    container.onclick = ()=>{
      if(c.bad){ container.classList.add('det-correct'); alert('Correct — this card contains inconsistencies.'); }
      else { container.classList.add('det-wrong'); alert('Not the one — look again.'); }
    };
    cardsDiv.appendChild(container);
  });

  document.getElementById('back').onclick = renderCreator;
}

/* ---------------- DETECTIVE CHALLENGE ----------------
   Generates 5 cards using available avatars/flags; exactly one contains an intentional inconsistency.
   Uses the same avatar/flag assets that are expected in the repo (root avatars/ and flags/).
*/
function renderDetectiveChallenge(){
  main.innerHTML = `
    <div class="panel">
      <h2>Detective Challenge — Spot the anomaly</h2>
      <p class="muted">One of these 5 IDs contains an inconsistency (mismatched flag, wrong race-avatar, or typo). Click the suspicious one.</p>
      <div id="challenge" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px"></div>
      <div style="margin-top:12px"><button id="back2" class="btn btn-ghost">Back</button></div>
    </div>
  `;

  const container = document.getElementById('challenge');

  // build pool from predefined lists (we assume assets exist for these)
  const pool = [];
  RACES.forEach(r=>{
    SEXES.forEach(s=>{
      pool.push({race:r.id, sex:s});
    });
  });

  // pick 5 distinct items
  const chosen = [];
  while(chosen.length < 5 && pool.length){
    const idx = Math.floor(Math.random()*pool.length);
    chosen.push(pool.splice(idx,1)[0]);
  }

  // build cards data using random nationalities and random names
  const cards = chosen.map((p,i)=>{
    const name = randomFullName();
    const role = ["Explorer","Pilot","Agent","Scientist","Smuggler","Diplomat"][Math.floor(Math.random()*6)];
    const dob = randomDOB();
    const nat = NATIONALITIES[Math.floor(Math.random()*NATIONALITIES.length)].id;
    return {name,role,dob,nat,race:p.race,sex:p.sex,bad:false};
  });

  // choose one index to be the anomaly
  const badIndex = Math.floor(Math.random()*cards.length);
  // apply one of several anomaly types
  const anomalyType = Math.floor(Math.random()*3); // 0 = wrong flag, 1 = race-avatar mismatch, 2 = typo in role
  if(anomalyType === 0){
    // wrong flag: pick a different nationality
    let alt = NATIONALITIES[Math.floor(Math.random()*NATIONALITIES.length)].id;
    while(alt === cards[badIndex].nat) alt = NATIONALITIES[Math.floor(Math.random()*NATIONALITIES.length)].id;
    cards[badIndex].nat = alt;
    cards[badIndex].bad = true;
    cards[badIndex].reason = 'Wrong flag';
  } else if(anomalyType === 1){
    // mismatch race vs avatar: swap avatar race to a different race (so avatar won't match declared race)
    let altRace = RACES[Math.floor(Math.random()*RACES.length)].id;
    while(altRace === cards[badIndex].race) altRace = RACES[Math.floor(Math.random()*RACES.length)].id;
    cards[badIndex].avatarRace = altRace; // avatar will show altRace, but declared race remains old
    cards[badIndex].bad = true;
    cards[badIndex].reason = 'Avatar mismatch';
  } else {
    // typo in role
    cards[badIndex].role = cards[badIndex].role + 's'; // simple typo
    cards[badIndex].bad = true;
    cards[badIndex].reason = 'Typo';
  }

  // render
  cards.forEach((c,idx)=>{
    const div = document.createElement('div');
    div.className='det-card';
    div.style.cursor='pointer';

    // avatar decision: use avatarRace if set (anomaly type 1), else use c.race
    const avatarRace = c.avatarRace || c.race;
    div.innerHTML = `
      <div style="display:flex;gap:10px;">
        <img src="${avatarPath(avatarRace, c.sex)}" style="width:72px;height:100px;object-fit:cover">
        <div style="flex:1">
          <div style="font-weight:700">${escapeHtml(c.name)}</div>
          <div class="muted">${escapeHtml(c.role)}</div>
          <div class="muted" style="margin-top:6px">DOB: ${escapeHtml(c.dob)}</div>
          <img src="${flagPath(c.nat)}" style="width:68px;height:46px;border-radius:6px;margin-top:6px">
        </div>
      </div>
    `;

    div.onclick = ()=>{
      if(idx === badIndex){
        div.classList.add('det-correct');
        // green scan flash
        flashScan('good');
        setTimeout(()=>{ alert('Correct — reason: ' + (cards[idx].reason || 'inconsistency found')); }, 150);
      } else {
        div.classList.add('det-wrong');
        // red scan flash
        flashScan('bad');
        setTimeout(()=>{ alert('Nope — that one seems valid.'); }, 150);
      }
    };

    container.appendChild(div);
  });

  document.getElementById('back2').onclick = renderCreator;
}

/* ---------------- small helpers for Detective Challenge ---------------- */
function randomFullName(){
  const first = ["Nova","Ori","Zeph","Kira","Vega","Juno","Nyx","Sol","Talon","Rin"];
  const last = ["Star","Kellan","Void","Storm","Eclipse","Rune","Corax","Mira"];
  return first[Math.floor(Math.random()*first.length)] + ' ' + last[Math.floor(Math.random()*last.length)];
}
function randomDOB(){
  const y = 2000 + Math.floor(Math.random()*200);
  const m = String(1+Math.floor(Math.random()*12)).padStart(2,'0');
  const d = String(1+Math.floor(Math.random()*28)).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

/* ---------------- scan flash helper ---------------- */
function flashScan(kind){
  const scan = document.getElementById('scan-overlay');
  const line = scan.querySelector('.scan-line');
  if(kind === 'good'){
    line.style.background = 'linear-gradient(90deg, transparent, #00ffcc, transparent)';
    line.style.boxShadow = '0 0 18px #00ffcc';
  } else {
    line.style.background = 'linear-gradient(90deg, transparent, #ff5b72, transparent)';
    line.style.boxShadow = '0 0 18px #ff5b72';
  }
  scan.classList.add('active');
  setTimeout(()=>{ scan.classList.remove('active'); line.style.background='linear-gradient(90deg,transparent,#00d4ff,transparent)'; line.style.boxShadow='0 0 14px #00d4ff'; }, 700);
}

/* ---------------- small util ---------------- */
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
