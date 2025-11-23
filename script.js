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

const SEXES = ["Male", "Female", "Other"];

/* Seeded random for factions */
function seededRandom(seed){
  let h=2166136261>>>0;
  for(let i=0;i<seed.length;i++){
    h ^= seed.charCodeAt(i);
    h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);
  }
  return function(){
    h += 0x6D2B79F5;
    var t=Math.imul(h^h>>>15,1|h);
    t^=t+Math.imul(t^t>>>7,61|t);
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

function generateFactions(planetId){
  const adjs=["Nova","Crimson","Azure","Silver","Radiant","Iron","Silent","Echo"];
  const nouns=["Order","Fleet","House","Conclave","Consortium","Union"];
  const rnd = seededRandom(planetId);
  const n = 2 + Math.floor(rnd()*3);
  const out=[];
  for(let i=0;i<n;i++){
    out.push(adjs[Math.floor(rnd()*adjs.length)] + " " +
             nouns[Math.floor(rnd()*nouns.length)]);
  }
  return out;
}

function avatarPath(r, s){
  return `avatars/${r}_${s.toLowerCase()}.png`;
}
function flagPath(n){
  return `flags/${n}.png`;
}

/* -------- Render Creator -------- */
const main=document.getElementById("main");
document.getElementById("createMode").onclick = renderCreator;
document.getElementById("detectMode").onclick = ()=>alert("Detective mode to be re-added later!");

renderCreator();

function renderCreator(){
  main.innerHTML=`
    <div class="panel">
      <div class="grid">

        <div>
          <label>Full name <input id="name" value="Nova Star"></label>
          <label>Role / Title <input id="role" value="Explorer"></label>
          <label>Birth date (fictional) <input id="dob" value="2124-07-08"></label>

          <label>Nationality (planet)
            <select id="nationality"></select>
          </label>

          <label>Faction
            <select id="faction" disabled><option>Select planet first</option></select>
          </label>

          <label>Race
            <select id="race"></select>
          </label>

          <label>Sex
            <select id="sex"></select>
          </label>

          <div style="display:flex; gap:10px; margin-top:12px">
            <button id="generate" class="btn">Generate preview</button>
            <button id="download" class="btn btn-accent">Download PNG</button>
          </div>
        </div>

        <div>
          <div class="card" id="preview">
            <div class="meta">GALAXIA ID</div>

            <div style="display:flex; gap:14px">
              <div class="photo" id="pvPhoto"></div>
              <div class="info">
                <div class="field-title">Name</div>
                <div class="field-value" id="pvName">Nova Star</div>

                <div class="field-title">Role</div>
                <div class="muted" id="pvRole">Explorer</div>

                <div class="field-title">DOB</div>
                <div class="muted" id="pvDob">2124-07-08</div>

                <div class="field-title">Sex</div>
                <div class="muted" id="pvSex">Other</div>

                <div class="field-title">Race</div>
                <div class="muted" id="pvRace">Human</div>

                <div class="field-title">Nationality
                  <img class="flag" id="pvFlag">
                </div>
                <div class="muted" id="pvNation"></div>
              </div>
            </div>

            <div class="pv-bottom" id="pvFaction">Faction: —</div>
          </div>
        </div>

      </div>
    </div>
  `;

  const natSel=document.getElementById("nationality");
  NATIONALITIES.forEach(n=>natSel.insertAdjacentHTML("beforeend",`<option value="${n.id}">${n.label}</option>`));

  const raceSel=document.getElementById("race");
  RACES.forEach(r=>raceSel.insertAdjacentHTML("beforeend", `<option value="${r.id}">${r.label}</option>`));

  const sexSel=document.getElementById("sex");
  SEXES.forEach(s=>sexSel.insertAdjacentHTML("beforeend", `<option>${s}</option>`));

  natSel.onchange=onNationalityChange;
  document.getElementById("generate").onclick=updatePreview;
  document.getElementById("download").onclick=downloadPNG;

  updatePreview();
}

function onNationalityChange(){
  const nat=document.getElementById("nationality").value;
  const fSel=document.getElementById("faction");

  fSel.innerHTML="";
  if(!nat){
    fSel.disabled=true;
    fSel.innerHTML="<option>Select planet first</option>";
  } else {
    const list=generateFactions(nat);
    list.forEach((f,i)=>fSel.insertAdjacentHTML("beforeend", `<option value="${i}">${f}</option>`));
    fSel.disabled=false;
  }
  updatePreview();
}

function updatePreview(){
  const name=document.getElementById("name").value;
  const role=document.getElementById("role").value;
  const dob=document.getElementById("dob").value;
  const nat=document.getElementById("nationality").value||"terra";
  const race=document.getElementById("race").value||"human";
  const sex=document.getElementById("sex").value||"Other";
  const factionIdx=document.getElementById("faction").value;

  document.getElementById("pvName").textContent=name;
  document.getElementById("pvRole").textContent=role;
  document.getElementById("pvDob").textContent=dob;
  document.getElementById("pvSex").textContent=sex;
  document.getElementById("pvRace").textContent=RACES.find(x=>x.id===race)?.label || race;
  document.getElementById("pvNation").textContent=NATIONALITIES.find(x=>x.id===nat)?.label;

  const factions=generateFactions(nat);
  document.getElementById("pvFaction").textContent="Faction: " + (factions[factionIdx] || "—");

  // FLAG
  const flag=document.getElementById("pvFlag");
  flag.src = flagPath(nat);

  // AVATAR
  const photo=document.getElementById("pvPhoto");
  photo.innerHTML = `<img src="${avatarPath(race, sex)}" style="width:100%;height:100%;object-fit:cover;">`;
}

/* ---------------- PNG Download with Scan ---------------- */
function downloadPNG(){
  const scan=document.getElementById("scan-overlay");
  scan.classList.add("active");

  setTimeout(()=>{
    const card = document.getElementById("preview");

    html2canvas(card,{
      backgroundColor:null,
      scale:2
    }).then(canvas=>{
      const a=document.createElement("a");
      a.download="galactic-id.png";
      a.href=canvas.toDataURL("image/png");
      a.click();

      setTimeout(()=>scan.classList.remove("active"),500);
    });

  },500);
}
