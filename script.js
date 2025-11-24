// Show the creation panel
function showCreator() {
document.getElementById("main-app").scrollIntoView({ behavior: "smooth" });
}


// Generate a random agent
function generateRandomAgent() {
const names = ["Nova Star", "Orion Vega", "Lyra X", "Astra Kel", "Zen Voltar"];
const roles = ["Explorer", "Technomancer", "Pilot", "Quantum Ranger", "Cyber Diplomat"];
const factions = ["Silver Order", "Nebula Corps", "Crimson Circle", "Void Syndicate"];
const races = ["Human", "Synth", "Aetherian", "Biomorph"];
const sexes = ["Male", "Female", "Non-Binary"];


document.getElementById("fullname").value = names[Math.floor(Math.random() * names.length)];
document.getElementById("role").value = roles[Math.floor(Math.random() * roles.length)];
document.getElementById("faction").value = factions[Math.floor(Math.random() * factions.length)];
document.getElementById("race").value = races[Math.floor(Math.random() * races.length)];
document.getElementById("sex").value = sexes[Math.floor(Math.random() * sexes.length)];


const year = 2100 + Math.floor(Math.random() * 80);
const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
document.getElementById("birthdate").value = `${year}-${month}-${day}`;
}


// Update preview card
function generatePreview() {
document.getElementById("preview-name").innerText = document.getElementById("fullname").value;
document.getElementById("preview-role").innerText = document.getElementById("role").value;
document.getElementById("preview-dob").innerText = document.getElementById("birthdate").value;
document.getElementById("preview-sex").innerText = document.getElementById("sex").value;
document.getElementById("preview-race").innerText = document.getElementById("race").value;
document.getElementById("preview-faction").innerText = document.getElementById("faction").value;


const nationality = document.getElementById("nationality").value;
document.getElementById("preview-flag").src = `flags/${nationality}.png`;


const avatarIndex = Math.floor(Math.random() * 5) + 1;
document.getElementById("preview-avatar").src = `avatars/avatar${avatarIndex}.png`;
}


// Placeholder download function
function downloadID() {
alert("Download PNG will be reconnected if you want!");
}