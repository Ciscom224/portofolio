// =========================================================
// UTILITAIRE : Notifications (Toasts) style "Tech / Glass"
// =========================================================
function showToast(msg, type = "info", timeout = 3500) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  
  // Style de base (Glassmorphism)
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    zIndex: "9999",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    transform: "translateX(100%)",
    opacity: "0",
    transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)"
  });

  // Couleurs selon le type (Néon Cyan pour succès/info, Rouge pour erreur)
  if (type === "error") {
    toast.style.background = "rgba(231, 76, 60, 0.85)";
    toast.style.borderLeft = "4px solid #c0392b";
  } else {
    toast.style.background = "rgba(0, 210, 255, 0.85)";
    toast.style.borderLeft = "4px solid #0096c7";
  }

  document.body.appendChild(toast);

  // Animation d'entrée
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  });

  // Animation de sortie et suppression
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, timeout);
}

// =========================================================
// VARIABLES GLOBALES
// =========================================================
let qrCode;

// =========================================================
// CONFIGURATION DES TYPES DE QR CODE
// =========================================================
const qrTypes = {
  url: {
    renderInputs: () => `
      <div style="max-width: 600px; margin: 0 auto; text-align: center; background: rgba(17, 25, 40, 0.6); padding: 40px 30px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);">
        
        <h3 style="color: #00d2ff; margin-bottom: 25px; font-size: 18px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <i class='bx bx-link' style="font-size: 24px;"></i> Générateur de Lien / Texte
        </h3>
        
        <textarea id="linkData" 
          placeholder="Entrez une URL (ex: https://github.com/...) ou un texte libre" rows="4"
          style="width: 100%; padding: 18px; margin-bottom: 25px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s; resize: vertical; font-family: 'Inter', sans-serif; line-height: 1.5;"
          onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 15px rgba(0,210,255,0.2)'" 
          onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'"></textarea>
        
        <div style="display: flex; justify-content: center; gap: 15px;">
          <button id="btnGen" class="btn" onclick="generateQR('url')">Générer le QR Code</button>
          <button id="downloadBtn" class="btn" style="display: none; background: #00d2ff; color: #070b14; border-color: #00d2ff; font-weight: 700; box-shadow: 0 0 15px rgba(0,210,255,0.4);" onclick="downloadQR()">Télécharger (PNG)</button>
        </div>
      </div>
    `,

    getData: () => {
      const qrData = document.getElementById("linkData");
      if (!qrData) {
        showToast("Erreur interne : champ introuvable.", "error");
        return null;
      }

      let dataValue = qrData.value.trim();

      if (!dataValue) {
        showToast("Veuillez entrer un lien ou un texte.", "error");
        return null;
      }

      // Si l'utilisateur a tapé "www.site.com" sans le https, on corrige intelligemment
      const urlRegex = /^www\.[a-z0-9-]+(\.[a-z0-9-]+)+/i;
      if (urlRegex.test(dataValue)) {
        dataValue = "https://" + dataValue;
      }

      return dataValue;
    },
  },

  vcard: {
    renderInputs: () => `
      <div id="qrInputs" style="display: flex; flex-wrap: wrap; gap: 40px; align-items: stretch; justify-content: center; text-align: left; width: 100%; margin-bottom: 30px;">
        
        <!-- ========================================== -->
        <!-- FORMULAIRE (Style Glassmorphism)           -->
        <!-- ========================================== -->
        <div id="vcardInput" style="flex: 1; min-width: 300px; background: rgba(17, 25, 40, 0.6); padding: 30px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);">
          <h3 style="color: #00d2ff; margin-bottom: 25px; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
            <i class='bx bx-edit' style="font-size: 22px;"></i> Vos coordonnées
          </h3>
          
          <input type="text" id="vName" placeholder="Nom" 
            style="width: 100%; padding: 14px 18px; margin-bottom: 15px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s;"
            onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 10px rgba(0,210,255,0.2)'" 
            onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
            
          <input type="text" id="vSurname" placeholder="Prénom" 
            style="width: 100%; padding: 14px 18px; margin-bottom: 15px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s;"
            onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 10px rgba(0,210,255,0.2)'" 
            onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
            
          <input type="text" id="vProf" placeholder="Titre / Profession (ex: Data Engineer)" 
            style="width: 100%; padding: 14px 18px; margin-bottom: 15px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s;"
            onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 10px rgba(0,210,255,0.2)'" 
            onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
            
          <input type="email" id="vEmail" placeholder="Email professionnel" 
            style="width: 100%; padding: 14px 18px; margin-bottom: 15px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s;"
            onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 10px rgba(0,210,255,0.2)'" 
            onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
            
          <input type="tel" id="vPhone" placeholder="Téléphone (ex: +33 6 00...)" 
            style="width: 100%; padding: 14px 18px; margin-bottom: 5px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 15px; outline: none; transition: all 0.3s;"
            onfocus="this.style.border='1px solid #00d2ff'; this.style.boxShadow='0 0 10px rgba(0,210,255,0.2)'" 
            onblur="this.style.border='1px solid rgba(255,255,255,0.1)'; this.style.boxShadow='none'">
        </div>

        <!-- ========================================== -->
        <!-- APERÇU (Carte de visite digitale premium)  -->
        <!-- ========================================== -->
        <div id="vcardPreview" style="flex: 1; min-width: 320px; max-width: 400px; background: linear-gradient(145deg, rgba(17,25,40,0.95), rgba(7,11,20,0.95)); padding: 40px 30px; border-radius: 20px; border: 1px solid rgba(0, 210, 255, 0.3); box-shadow: 0 15px 35px rgba(0, 210, 255, 0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; transition: transform 0.4s ease;">
          
          <!-- Effet de reflet en arrière-plan -->
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 60%); pointer-events: none;"></div>
          
          <!-- Avatar central -->
          <div class="profile-icon" style="width: 85px; height: 85px; border-radius: 50%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; border: 2px solid #00d2ff; box-shadow: 0 0 20px rgba(0,210,255,0.4); margin-bottom: 20px; z-index: 1;">
            <i class="bx bxs-user" style="font-size: 45px; color: #00d2ff;"></i>
          </div>
          
          <!-- Identité -->
          <h2 id="previewName" style="color: #fff; margin-bottom: 5px; font-weight: 700; font-size: 24px; z-index: 1; text-align: center;">Nom Prénom</h2>
          <p id="previewProf" style="color: #00d2ff; font-size: 13px; font-weight: 600; margin-bottom: 30px; letter-spacing: 1.5px; text-transform: uppercase; z-index: 1; text-align: center;">Profession</p>
          
          <!-- Informations de contact (liste épurée) -->
          <div style="width: 100%; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px; z-index: 1;">
            
            <div style="display: flex; align-items: center; margin-bottom: 18px; color: #cbd5e1; font-size: 15px;">
              <div style="min-width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-right: 15px; border: 1px solid rgba(255,255,255,0.05);">
                <i class='bx bx-envelope' style="color: #00d2ff; font-size: 20px;"></i>
              </div>
              <span id="previewEmail" style="word-break: break-all;">Email</span>
            </div>
            
            <div style="display: flex; align-items: center; color: #cbd5e1; font-size: 15px;">
              <div style="min-width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-right: 15px; border: 1px solid rgba(255,255,255,0.05);">
                <i class='bx bx-phone' style="color: #00d2ff; font-size: 20px;"></i>
              </div>
              <span id="previewPhone">Téléphone</span>
            </div>
            
          </div>
        </div>

      </div>

      <div style="display: flex; justify-content: center; gap: 15px;">
        <button id="btnGen" class="btn" onclick="generateQR('vcard')">Générer la vCard</button>
        <button id="downloadBtn" class="btn" style="display: none; background: #00d2ff; color: #070b14;" onclick="downloadQR()">Télécharger</button>
      </div>
    `,

    getData: () => {
      const name = document.getElementById("vName")?.value.trim();
      const surname = document.getElementById("vSurname")?.value.trim();
      const email = document.getElementById("vEmail")?.value.trim();
      const prof = document.getElementById("vProf")?.value.trim();
      const phone = document.getElementById("vPhone")?.value.trim();

      if (!name || !surname) {
        showToast("Le nom et le prénom sont obligatoires.", "error");
        return null;
      }
      if (!prof) {
        showToast("Veuillez renseigner votre profession.", "error");
        return null;
      }

      // Génération de la string vCard 3.0
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

      showToast("Génération du QR Code réussie !", "success");
      return vcardData;
    },
  },
};

// =========================================================
// FONCTIONS PRINCIPALES
// =========================================================

// Mettre à jour l'interface selon le type choisi (Lien ou vCard)
window.updateInputs = function (type) {
  const container = document.getElementById("qrInputs");
  if (!container) return;
  
  container.innerHTML = qrTypes[type].renderInputs();
  
  // Réinitialiser la zone du QR code
  document.getElementById("qrcode").innerHTML = "";
  
  if (type === "vcard") {
    initVcardPreview();
  }
};

// Générer le QR Code avec QRCodeStyling
window.generateQR = function (type) {
  const data = qrTypes[type].getData();
  if (!data) return;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // Nettoie l'ancien QR code

  // Configuration graphique du QR Code (Theme Tech / Cyan)
  qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    data: data,
    margin: 10,
    dotsOptions: {
      color: "#070b14", // Bleu très sombre (presque noir)
      type: "rounded", 
    },
    backgroundOptions: {
      color: "#ffffff", // Fond blanc pour garantir le contraste de scan
    },
    cornersSquareOptions: {
      color: "#3a7bd5", // Bleu secondaire
      type: "extra-rounded", 
    },
    cornersDotOptions: {
      color: "#00d2ff", // Bleu Néon / Cyan
      type: "dot"
    },
  });

  qrCode.append(qrContainer);

  // Animations sur les boutons
  document.getElementById("btnGen").style.display = "none";
  document.getElementById("downloadBtn").style.display = "inline-block";
};

// Télécharger l'image générée
window.downloadQR = function () {
  if (qrCode) {
    qrCode.download({ name: "MamadouCisse_QRCode", extension: "png" });
    showToast("Téléchargement lancé !", "success");
  }
};

// Gestionnaire de l'aperçu dynamique de la vCard
function initVcardPreview() {
  const inputs = {
    name: document.getElementById("vName"),
    surname: document.getElementById("vSurname"),
    prof: document.getElementById("vProf"),
    email: document.getElementById("vEmail"),
    phone: document.getElementById("vPhone")
  };

  const previews = {
    name: document.getElementById("previewName"),
    prof: document.getElementById("previewProf"),
    email: document.getElementById("previewEmail"),
    phone: document.getElementById("previewPhone")
  };

  // Mise à jour à chaque frappe
  Object.values(inputs).forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => {
      const fullName = `${inputs.surname.value} ${inputs.name.value}`.trim();
      previews.name.textContent = fullName || "Nom Prénom";
      previews.prof.textContent = inputs.prof.value || "Profession";
      previews.email.textContent = inputs.email.value || "Email";
      previews.phone.textContent = inputs.phone.value || "Téléphone";
    });
  });
}

// =========================================================
// INITIALISATION AU CHARGEMENT
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  // On initialise par défaut sur vCard (ou 'url' selon ton HTML)
  updateInputs("vcard");
});