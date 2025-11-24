// ---------------- AUTH SCAN ----------------
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay-auth');
  const app = document.getElementById('app');
  const btn = document.getElementById('authStart');

  btn.addEventListener('click', () => {
    btn.textContent = "Scan en cours...";
    btn.disabled = true;

    setTimeout(() => {
      overlay.classList.add('hidden');
      app.classList.remove('hidden');
    }, 1500);
  });

  document.getElementById('createMode').onclick = renderCreator;
  document.getElementById('randomAgent').onclick = generateRandomAgent;

  renderCreator();
});

// ---------------- DATA ----------------
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
  {id:'vesharian', label:'Vesharian (energy)'},
  {id:'zorvian', label:'Zorvian (insectoid)'},
  {id:'synth', label:'Synth android'}
];

const SEXES = ['Male','Female','Other'];

function avatarPath(r,s){ return `avatars/${r}_${s.toLowerCase()}.png`; }
function flagPath(n){ return `flags/${n}.png`; }

// ---------------- UI CREATOR ----------------
function renderCreator(){
  const main = document.getElementById('main');

  main.innerHTML = `
    <div class="panel">
      <h2>Création d'identité galactique</h2>

      <label>Nom complet
        <input id="name" value="Nova Star">
      </label>

      <label>Rôle
        <input id="role" value="Explorer">
      </label>

      <label>Date de naissance
        <input id="dob" value="2124-07-08">
      </label>

      <label>Nationalité
        <select id="nationality"><option value="">— Choisir —</option></select>
      </label>

      <label>Race
        <select id="race"></select>
      </label>

      <label>Sexe
        <select id="sex"></select>
      </label>

      <button id="generate" class="btn">Mettre à jour le preview</button>
      <button id="download" class="btn btn-ghost">Télécharger PNG</button>

      <div style="margin-top:20px;display:flex;gap:20px">
        <div>
          <div class="card">
            <div style="display:flex;gap:14px;">
              <div class="photo" id="pvPhoto"></div>
              <div>
                <div id="pvName" style="font-size:18px;font-weight:700;">Nova Star</div>
                <div id="pvRole" style="color:var(--muted)">Explorer</div>
                <div id="pvDob" style="color:var(--muted);margin-top:6px;">2124-07-08</div>
                <div id="pvSex" style="color:var(--muted);margin-top:6px;">Other</div>
                <div id="pvRace" style="color:var(--muted);margin-top:6px;">Human</div>
                <div style="margin-top:8px;">
                  Nationalité <img id="pvFlag" class="flag" src="">
                </div>
                <div id="pvNation" style="color:var(--muted)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remplir les listes
  const natSel = document.getElementById('nationality');
  NATIONALITIES.forEach(n => natSel.insertAdjacentHTML("beforeend",
    `<option value="${n.id}">${n.label}</option>`));

  const raceSel = document.getElementById('race');
  RACES.forEach(r => raceSel.insertAdjacentHTML("beforeend",
    `<option value="${r.id}">${r.label}</option>`));

  const sexSel = document.getElementById('sex');
  SEXES.forEach(s => sexSel.insertAdjacentHTML("beforeend",
    `<option value="${s}">${s}</option>`));

  document.getElementById('generate').onclick = updatePreview;
  document.getElementById('nationality').onchange = updatePreview;
  document.getElementById('download').onclick = downloadPNG;

  updatePreview();
}

// ---------------- PREVIEW ----------------
function updatePreview(){
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  const dob = document.getElementById('dob').value;
  const nat = document.getElementById('nationality').value || "terra";
  const race = document.getElementById('race').value || "human";
  const sex = document.getElementById('sex').value || "Other";

  document.getElementById('pvName').textContent = name;
  document.getElementById('pvRole').textContent = role;
  document.getElementById('pvDob').textContent = dob;
  document.getElementById('pvSex').textContent = sex;
  document.getElementById('pvRace').textContent = RACES.find(r=>r.id===race).label;
  document.getElementById('pvNation').textContent = NATIONALITIES.find(n=>n.id===nat).label;

  const flag = document.getElementById('pvFlag');
  flag.src = flagPath(nat);

  const photoEl = document.getElementById('pvPhoto');
  photoEl.innerHTML = `<img src="${avatarPath(race,sex)}" style="width:100%;height:100%;object-fit:cover;">`;
}

// ---------------- RANDOM AGENT ----------------
function generateRandomAgent(){
  document.getElementById('name').value = "Agent " + Math.floor(Math.random()*9999);
  document.getElementById('role').value = "Operative";
  document.getElementById('dob').value = "21" + Math.floor(Math.random()*30) + "-0" + (1+Math.floor(Math.random()*8)) + "-0" + (1+Math.floor(Math.random()*8));
  document.getElementById('nationality').selectedIndex = 1+Math.floor(Math.random()*5);
  document.getElementById('race').selectedIndex = 1+Math.floor(Math.random()*5);
  document.getElementById('sex').selectedIndex = Math.floor(Math.random()*3);
  updatePreview();
}

// ---------------- DOWNLOAD PNG ----------------
function downloadPNG(){
  alert("Download PNG sera réactivé après tes tests !");
}
