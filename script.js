/* ===========================================================
   MINI-GAME : ALIEN SYMBOL AUTHENTICATION
   =========================================================== */
const overlay = document.getElementById("overlay-game");
const app = document.getElementById("app");

const alienSymbols = ["✦", "☽", "✧", "✹", "✶"];
let correctSymbol = alienSymbols[Math.floor(Math.random() * alienSymbols.length)];

const symbolContainer = document.getElementById("symbols");
const gameMsg = document.getElementById("game-msg");

// Display symbols
alienSymbols.forEach(sym => {
  const btn = document.createElement("div");
  btn.className = "symbol-btn";
  btn.textContent = sym;
  btn.onclick = () => checkSymbol(sym);
  symbolContainer.appendChild(btn);
});

function checkSymbol(choice) {
  if (choice === correctSymbol) {
    gameMsg.style.color = "var(--good)";
    gameMsg.textContent = "Access Granted ✓";
    setTimeout(() => {
      overlay.classList.add("hidden");
      app.classList.remove("hidden");
    }, 700);
  } else {
    gameMsg.style.color = "var(--bad)";
    gameMsg.textContent = "Access Denied ✘";
  }
}

/* ===========================================================
   DATA CONFIG
   =========================================================== */
const NATIONALITIES = [
  { id: "terra", label: "Terran (Earth)" },
  { id: "aurelion", label: "Aurelian (Aurelia)" },
  { id: "kaldor", label: "Kaltorian (Kaldor)" },
  { id: "veshara", label: "Veshari (Vesha)" },
  { id: "zorvia", label: "Zorvian (Zorvia)" }
];

const RACES = [
  { id: "human", label: "Human" },
  { id: "aurelian", label: "Aurelian (avian)" },
  { id: "kaltorian", label: "Kaltorian (reptilian)" },
  { id: "vesharian", label: "Vesharian (energy being)" },
  { id: "zorvian", label: "Zorvian (insectoid)" },
  { id: "synth", label: "Synth (android)" }
];

const SEXES = ["Male", "Female", "Other"];

/* ===========================================================
   DETERMINISTIC FACTIONS
   =========================================================== */
function seededRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return function () {
    h += 0x6D2B79F5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function factionCount(planetId) {
  const r = seededRandom(planetId)();
  return 2 + Math.floor(r * 4);
}

function generateFactions(planetId) {
  const adj = ["Nova", "Crimson", "Azure", "Silver", "Obsidian", "Radiant", "Iron", "Solar", "Lunar", "Vanguard", "Silent", "Echo"];
  const nouns = ["Guard", "Consortium", "Union", "Syndicate", "Collective", "Order", "Fleet", "Guild", "House", "Conclave"];
  const rnd = seededRandom(planetId + "_f");
  const n = factionCount(planetId);
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(adj[Math.floor(rnd() * adj.length)] + " " + nouns[Math.floor(rnd() * nouns.length)]);
  }
  return out;
}

/* ===========================================================
   IMAGE PATHS
   =========================================================== */
function avatarPath(race, sex) {
  return `avatars/${race}_${sex.toLowerCase()}.png`;
}
function flagPath(id) {
  return `flags/${id}.png`;
}

/* ===========================================================
   MAIN RENDERING
   =========================================================== */
const main = document.getElementById("main");
document.getElementById("createMode").onclick = renderCreator;
document.getElementById("detectMode").onclick = renderDetector;
document.getElementById("randomAgent").onclick = generateRandomAgent;

/* -------------------
   RENDER CREATOR
   ------------------- */
function renderCreator() {
  main.innerHTML = `
    <div class="panel">
      <div class="grid">
        <div>
          <label>Full name <input id="name"></label>
          <label>Role <input id="role"></label>
          <label>Date of Birth <input id="dob"></label>

          <label>Nationality
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

          <button id="generate" class="btn" style="margin-top:10px">Generate Preview</button>
          <button id="download" class="btn btn-accent" style="margin-top:10px">Download PNG</button>
        </div>

        <div>
          <div class="card" id="preview">
            <div class="meta">GALAXIA ID</div>

            <div style="display:flex; gap:14px;">
              <div class="photo" id="pvPhoto"></div>
              <div>
                <div class="field-title">Name</div>
                <div id="pvName" class="field-value"></div>

                <div class="field-title" style="margin-top:6px">Role</div>
                <div id="pvRole" class="muted"></div>

                <div class="field-title" style="margin-top:6px">DOB</div>
                <div id="pvDob" class="muted"></div>

                <div class="field-title" style="margin-top:6px">Sex</div>
                <div id="pvSex" class="muted"></div>

                <div class="field-title" style="margin-top:6px">Race</div>
                <div id="pvRace" class="muted"></div>

                <div class="field-title" style="margin-top:6px">
                  Nationality <img id="pvFlag" class="flag">
                </div>
                <div id="pvNation" class="muted"></div>
              </div>
            </div>

            <div class="pv-bottom" id="pvFaction">Faction: —</div>
          </div>
        </div>

      </div>
    </div>
  `;

  const natSel = document.getElementById("nationality");
  NATIONALITIES.forEach(n => natSel.insertAdjacentHTML("beforeend", `<option value="${n.id}">${n.label}</option>`));

  const raceSel = document.getElementById("race");
  RACES.forEach(r => raceSel.insertAdjacentHTML("beforeend", `<option value="${r.id}">${r.label}</option>`));

  const sexSel = document.getElementById("sex");
  SEXES.forEach(s => sexSel.insertAdjacentHTML("beforeend", `<option>${s}</option>`));

  document.getElementById("nationality").onchange = onNationalityChange;
  document.getElementById("generate").onclick = updatePreview;
  document.getElementById("download").onclick = downloadPNG;
}

/* -------------------
   NATIONALITY → FACTIONS
   ------------------- */
function onNationalityChange() {
  const nat = document.getElementById("nationality").value;
  const factionSel = document.getElementById("faction");

  factionSel.innerHTML = "";

  if (!nat) {
    factionSel.disabled = true;
    factionSel.innerHTML = "<option>(select planet first)</option>";
  } else {
    const list = generateFactions(nat);
    list.forEach((f, i) => factionSel.insertAdjacentHTML("beforeend", `<option value="${i}">${f}</option>`));
    factionSel.disabled = false;
  }

  updatePreview();
}

/* -------------------
   UPDATE PREVIEW
   ------------------- */
function updatePreview() {
  const name = document.getElementById("name")?.value || "";
  const role = document.getElementById("role")?.value || "";
  const dob = document.getElementById("dob")?.value || "";
  const nat = document.getElementById("nationality")?.value || "";
  const race = document.getElementById("race")?.value || "human";
  const sex = document.getElementById("sex")?.value || "Other";
  const factionIdx = document.getElementById("faction")?.value;

  const factions = nat ? generateFactions(nat) : [];
  const factionText = factions[factionIdx] || "—";

  document.getElementById("pvName").textContent = name;
  document.getElementById("pvRole").textContent = role;
  document.getElementById("pvDob").textContent = dob;
  document.getElementById("pvSex").textContent = sex;
  document.getElementById("pvRace").textContent = RACES.find(r => r.id === race)?.label;
  document.getElementById("pvNation").textContent = NATIONALITIES.find(n => n.id === nat)?.label;
  document.getElementById("pvFaction").textContent = "Faction: " + factionText;

  // Flag
  const flagEl = document.getElementById("pvFlag");
  flagEl.src = flagPath(nat || "terra");

  // Avatar
  const photoEl = document.getElementById("pvPhoto");
  photoEl.innerHTML = `<img src="${avatarPath(race, sex)}" style="width:100%;height:100%;object-fit:cover">`;
}

/* ===========================================================
   RANDOM AGENT GENERATOR
   =========================================================== */
function generateRandomAgent() {
  const randomName = [
    "Nova", "Orion", "Zephyr", "Kyra", "Axis", "Vega", "Juno", "Nyx", "Solara", "Talon"
  ][Math.floor(Math.random() * 10)] + " " + [
    "Starborn", "Voidrunner", "Eclipse", "Stormbreaker", "Skydancer", "Cipher"
  ][Math.floor(Math.random() * 6)];

  document.getElementById("name").value = randomName;

  document.getElementById("role").value = ["Explorer", "Pilot", "Scientist", "Hunter", "Agent", "Diplomat"][Math.floor(Math.random() * 6)];

  document.getElementById("dob").value = (2000 + Math.floor(Math.random() * 150)) + "-" +
    String(1 + Math.floor(Math.random() * 12)).padStart(2, "0") + "-" +
    String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");

  const nat = NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)].id;
  document.getElementById("nationality").value = nat;

  onNationalityChange();

  document.getElementById("race").value = RACES[Math.floor(Math.random() * RACES.length)].id;
  document.getElementById("sex").value = SEXES[Math.floor(Math.random() * SEXES.length)];

  updatePreview();
}

/* ===========================================================
   PNG DOWNLOAD
   =========================================================== */
function downloadPNG() {
  alert("Download PNG is not yet reconnected — I can reconnect it for you après test si tu veux !");
}

/* ===========================================================
   DETECTIVE MODE
   =========================================================== */
function renderDetector() {
  main.innerHTML = `
    <div class="panel">
      <h2>Detective Mode — Find the fake ID</h2>
      <p class="muted">Click the fake one.</p>
      <div id="cards" style="display:flex;gap:12px;flex-wrap:wrap;"></div>
      <button id="back" class="btn btn-ghost" style="margin-top:10px">Back</button>
    </div>
  `;

  const cardsDiv = document.getElementById("cards");

  const examples = [
    {name:"Nova Star", role:"Explorer", dob:"2124-07-08", nat:"terra", race:"human", sex:"Female", bad:false},
    {name:"Ori Kellan", role:"Merchant", dob:"2118-03-22", nat:"aurelion", race:"aurelian", sex:"Male", bad:false},
    {name:"L0ra-9", role:"Pilot", dob:"2099-11-11", nat:"kaldor", race:"kaltorian", sex:"Other", bad:false},
    {name:"Max Storm", role:"Explorerrs", dob:"2130-02-05", nat:"veshara", race:"kaltorian", sex:"Male", bad:true}
  ];

  examples.sort(() => Math.random() - 0.5);

  examples.forEach(c => {
    const div = document.createElement("div");
    div.style.width = "240px";
    div.style.cursor = "pointer";

    div.innerHTML = `
      <div style="background:linear-gradient(180deg,#07172a,#071b2e);padding:10px;border-radius:8px;">
        <div style="display:flex;gap:10px;">
          <img src="${avatarPath(c.race, c.sex)}" style="width:72px;height:100px;border-radius:6px;object-fit:cover;">
          <div>
            <b>${c.name}</b><br>
            <span class="muted">${c.role}</span><br>
            <span class="muted">DOB: ${c.dob}</span><br>
            <img src="${flagPath(c.nat)}" style="width:68px;height:46px;border-radius:6px;margin-top:6px;">
          </div>
        </div>
      </div>
    `;

    div.onclick = () => {
      if (c.bad) {
        alert("Correct — that one is wrong!");
      } else {
        alert("Nope, that one is valid!");
      }
    };

    cardsDiv.appendChild(div);
  });

  document.getElementById("back").onclick = renderCreator;
}
