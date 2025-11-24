/* =========================================================
   SCAN GALACTIQUE — Déblocage de l'interface
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const startScanBtn = document.getElementById("startScan");
    const scanSection = document.getElementById("scan-section");
    const scanLoading = document.getElementById("scan-loading");
    const mainApp = document.getElementById("main-app");

    // Démarre le scan
    if (startScanBtn) {
        startScanBtn.addEventListener("click", () => {

            // Affiche "Scan en cours..."
            scanLoading.style.display = "flex";

            // Animation + temps d'attente
            setTimeout(() => {

                // Cache la zone scan
                scanSection.style.display = "none";
                scanLoading.style.display = "none";

                // Montre le vrai site
                mainApp.style.display = "block";

            }, 3000); // 3 secondes
        });
    }

});

/* =========================================================
   GÉNÉRATION D'AGENT ALÉATOIRE
========================================================= */

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

    // Date aléatoire futuriste
    const year = 2100 + Math.floor(Math.random() * 80);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
    document.getElementById("birthdate").value = `${year}-${month}-${day}`;
}

/* =========================================================
   PRÉVISUALISATION DE LA GALACTICA ID
========================================================= */

function generatePreview() {

    const idName = document.getElementById("fullname").value;
    const idRole = document.getElementById("role").value;
    const idFaction = document.getElementById("faction").value;
    const idRace = document.getElementById("race").value;
    const idSex = document.getElementById("sex").value;
    const idBirth = document.getElementById("birthdate").value;

    // Mise à jour de la carte
    document.getElementById("preview-name").innerText = idName;
    document.getElementById("preview-role").innerText = idRole;
    document.getElementById("preview-faction").innerText = idFaction;
    document.getElementById("preview-race").innerText = idRace;
    document.getElementById("preview-sex").innerText = idSex;
    document.getElementById("preview-dob").innerText = idBirth;

    // Avatar dynamique
    const avatarIndex = Math.floor(Math.random() * 5) + 1;
    document.getElementById("preview-avatar").src = `avatars/avatar${avatarIndex}.png`;

    // Drapeau
    const nationality = document.getElementById("nationality").value;
    document.getElementById("preview-flag").src = `flags/${nationality}.png`;
}

/* =========================================================
   DOWNLOAD PNG
========================================================= */

function downloadID() {
    alert("Download PNG is not reconnected yet — I can reconnect it for you si tu veux !");
}
