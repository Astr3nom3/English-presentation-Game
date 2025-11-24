// --- Auth Scan ---
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


// --- Data ---
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


function avatarPath(r,s){return `avatars/${r}_${s.toLowerCase()}.png`;}
function flagPath(n){return `flags/${n}.png`;}


// --- Creator UI ---
function renderCreator(){
const main = document.getElementById('main');
main.innerHTML = `
<div class="panel">
<h2>Création d'identité galactique</h2>
<label>Nom complet <input id="name" value="Nova Star"></label>
<label>Rôle <input id="role" value="Explorer"></label>
<label>Date de naissance <input id="dob" value="2124-07-08"></label>


<label>Nationalité
<select id="nationality"><option value="">— Choisir —</option></select>
</label>
<label>Race <select id="race"></select></label>
<label>Sexe <select id="sex"></select></label>


<button id="generate" class="btn" style