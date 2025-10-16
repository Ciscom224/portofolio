// Utilitaire : jolie notification temporaire (toast)
function showToast(msg, type = "info", timeout = 3000) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.right = "0";
  toast.style.top = "0";
  toast.style.padding = "5px 15px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = 9999;
  toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
  toast.style.color = "#fff";
  toast.style.opacity = "0.5";
  if (type === "error") toast.style.background = "#e74c3c";
  else if (type === "success") toast.style.background = "#27ae60";
  else toast.style.background = "#333";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), timeout);
}
let qrCode;

// Définition des types
const qrTypes = {
  url: {
    renderInputs: () => `
    <textarea id="linkData" class="message-placeholder" 
      placeholder="Exemple : https://monportfolio.com ou Mon texte..." rows="3"></textarea>
    <a href="#qrcode-section" id="btnGen" class="btnqr"  onclick="generateQR('url')">Générer</a>
    <a href="#qrcode-section" id="downloadBtn" class="btnqr" style="display: none;" onclick="downloadQR()">Télécharger</a>
  `,

    getData: () => {
      const qrData = document.getElementById("linkData");

      // Vérifie si l’élément existe
      if (!qrData) {
        showToast("Erreur interne : champ introuvable.", "error");
        return null;
      }

      const link = qrData.value.trim();

      // Vérifie si le champ est vide
      if (!link) {
        showToast("Veuillez entrer un lien ou un texte.", "error");
        return null;
      }

      // Optionnel : validation d’un lien
      const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\/\w .-]*)*\/?$/;
      if (!urlRegex.test(link)) {
        showToast(
          "Le lien semble invalide (ex : https://monsite.com).",
          "error"
        );
        return null;
      }

      return link;
    },
  },

  vcard: {
    renderInputs: () => `
      <div id="qrInputs" style="display: flex; gap: 20px;">
        <!-- Formulaire -->
        <div id="vcardInput" style="flex: 1;">
          <input type="text" id="vName" placeholder="Nom"><br>
          <input type="text" id="vSurname" placeholder="Prénom"><br>
          <input type="text" id="vProf" placeholder="Profession"> <br>
          <input type="email" id="vEmail" placeholder="Email"><br>
          <input type="tel" id="vPhone" placeholder="Téléphone"><br>
        </div>

        <!-- Aperçu -->
<div id="vcardPreview">
  <div class="profile-icon">
    <i class="bx bxs-user"></i>
  </div>

  <h2 id="previewName">Nom Prénom</h2>

  <div class="info-line">
    <label>💼 Profession :</label>
    <strong id="previewProf">Profession</strong>
  </div>

  <div class="info-line">
    <label>📧 Email :</label>
    <strong id="previewEmail">Email</strong>
  </div>

  <div class="info-line">
    <label>📞 Téléphone :</label>
    <strong id="previewPhone">Téléphone</strong>
  </div>
</div>

</div>

      </div>
      <a href="#qrcode-section" id="btnGen" class="btnqr"   onclick="generateQR('vcard')">Générer</a>
      <a href="#qrcode-section" id="downloadBtn" class="btndown" style="display: none;" onclick="downloadQR()">Télécharger</a>

    `,

    getData: () => {
      const nameEl = document.getElementById("vName");
      const surnameEl = document.getElementById("vSurname");
      const emailEl = document.getElementById("vEmail");
      const profEl = document.getElementById("vProf");
      const phoneEl = document.getElementById("vPhone");

      // Vérification que les champs existent
      if (!nameEl || !surnameEl || !emailEl || !profEl || !phoneEl) {
        showToast("Formulaire introuvable ou incomplet.", "error");
        return null;
      }

      const name = nameEl.value.trim();
      const surname = surnameEl.value.trim();
      const email = emailEl.value.trim();
      const prof = profEl.value.trim();
      const phone = phoneEl.value.trim();

      // Validation basique
      if (!name || !surname) {
        showToast("Veuillez entrer le nom et le prénom.", "error");
        return null;
      }

      if (!prof) {
        showToast("Veuillez entrer votre profession.", "error");
        return null;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast("Veuillez entrer un email valide.", "error");
        return null;
      }

      const phoneRegex = /^[0-9+\s-]{6,20}$/;
      if (!phone || !phoneRegex.test(phone)) {
        showToast("Veuillez entrer un numéro de téléphone valide.", "error");
        return null;
      }

      // ✅ Génération correcte de la vCard
      const vcardData = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${surname};${name};;;`,
        `FN:${name} ${surname}`,
        `TITLE:${prof}`,
        `EMAIL:${email}`,
        `TEL:${phone}`,
        "END:VCARD",
      ].join("\n");

      console.log("✅ vCard générée :\n", vcardData);
      return vcardData;
    },
  },
};

// --- Gestion affichage ---
function updateInputs(type) {
  document.getElementById("qrInputs").innerHTML = qrTypes[type].renderInputs();
  if (type === "vcard") {
    initVcardPreview();
  }
}

// --- Génération QR ---
function generateQR(type) {
  const data = qrTypes[type].getData();
  if (!data) return;

  document.getElementById("qrcode").innerHTML = "";
  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: data,
    dotsOptions: {
      color: "#000", // couleur des points
      type: "rounded", // forme : 'dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'
    },
    backgroundOptions: {
      color: "#fff", // couleur de fond
    },
    cornersSquareOptions: {
      color: "#000", // couleur des carrés d’angles
      type: "extra-rounded", // forme : 'square', 'dot', 'extra-rounded'
    },
    cornersDotOptions: {
      color: "#942219", // couleur des points dans les coins
    },
  });
  qrCode.append(document.getElementById("qrcode"));

  document.getElementById("downloadBtn").style.display = "block";
  document.getElementById("btnGen").style.display = "none";
}

// --- Télécharger QR ---
function downloadQR() {
  if (qrCode) qrCode.download({ name: "qrcode", extension: "png" });
  document.getElementById("downloadBtn").style.display = "none";
  document.getElementById("btnGen").style.display = "block";
}
function initVcardPreview() {
  const nameEl = document.getElementById("vName");
  const surnameEl = document.getElementById("vSurname");
  const profEl = document.getElementById("vProf");
  const emailEl = document.getElementById("vEmail");
  const phoneEl = document.getElementById("vPhone");

  const previewName = document.getElementById("previewName");
  const previewProf = document.getElementById("previewProf");
  const previewEmail = document.getElementById("previewEmail");
  const previewPhone = document.getElementById("previewPhone");

  // Rafraîchir en temps réel
  [nameEl, surnameEl, emailEl, phoneEl, profEl].forEach((input) => {
    input.addEventListener("input", () => {
      previewName.textContent =
        (nameEl.value + " " + surnameEl.value).trim() || "Nom Prénom";
      previewProf.textContent = profEl.value || "Profession";
      previewEmail.textContent = emailEl.value || "Email";
      previewPhone.textContent = phoneEl.value || "Téléphone";
    });
  });
}

// Initialisation avec URL
updateInputs("url");
updateInputs("vcard");
