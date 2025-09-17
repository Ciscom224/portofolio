  let qrCode;

  // Définition des types de QR
  const qrTypes = {
    url: {
      renderInputs: () => `
        <textarea id="qrData" placeholder="Exemple : https://monportfolio.com ou Mon texte..." rows="3"></textarea>
        <button class="btn" onclick="generateQR('url')">Générer QR Code</button>
      `,
      getData: () => document.getElementById("qrData").value.trim()
    },
    vcard: {
      renderInputs: () => `
        <div style="display: flex; gap: 20px; align-items: flex-start; font-family: Arial, sans-serif;">

  <!-- Formulaire vCard -->
  <div id="vcardInput" style="flex: 1; display: block;">
    <input type="text" id="vName" placeholder="Nom" style="width: 100%; padding: 8px; margin-bottom: 10px;"><br> 
    <input type="text" id="vSurname" placeholder="Prénom" style="width: 100%; padding: 8px; margin-bottom: 10px;"><br> 
    <input type="email" id="vEmail" placeholder="Email" style="width: 100%; padding: 8px; margin-bottom: 10px;"><br>
    <input type="tel" id="vPhone" placeholder="Téléphone" style="width: 100%; padding: 8px; margin-bottom: 10px;"><br>
  </div>

  <!-- Aperçu carte de visite -->
  <div id="vcardPreview" style="
        flex: 1; 
        max-width: 350px; 
        height: 200px; 
        border-radius: 15px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
        padding: 20px; 
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
      ">
    <h2 id="previewName" style="margin: 0; font-size: 1.5em;">Nom Prénom</h2>
    <p id="previewEmail" style="margin: 5px 0;">Email</p>
    <p id="previewPhone" style="margin: 5px 0;">Téléphone</p>
  </div>
</div>
      `,
      getData: () => {
        const name = document.getElementById("vName").value.trim();
        const surname = document.getElementById("vSurname").value.trim();
        const email = document.getElementById("vEmail").value.trim();
        const phone = document.getElementById("vPhone").value.trim();

        return `BEGIN:VCARD
VERSION:3.0
FN:${name} ${surname}
EMAIL:${email}
TEL:${phone}
END:VCARD`;
      }
    }
  };

  // Mise à jour des inputs selon le type choisi
  function updateInputs(type) {
    document.getElementById("qrInputs").innerHTML = qrTypes[type].renderInputs();
  }

  // Générer QR code
  function generateQR(type) {
    const data = qrTypes[type].getData();
    if (!data) {
      alert("Veuillez entrer des données !");
      return;
    }

    document.getElementById("qrcode").innerHTML = "";
    qrCode = new QRCodeStyling({
      width: 200,
      height: 200,
      data: data,
      dotsOptions: { color: "#000", type: "rounded" },
      backgroundOptions: { color: "#fff" }
    });
    qrCode.append(document.getElementById("qrcode"));

    document.getElementById("downloadBtn").style.display = "inline-block";
  }

  // Télécharger QR
  document.getElementById("downloadBtn").addEventListener("click", () => {
    if (qrCode) qrCode.download({ name: "qrcode", extension: "png" });
  });

  // Écouteurs radio
  document.querySelectorAll('input[name="qrType"]').forEach(el => {
    el.addEventListener("change", e => updateInputs(e.target.value));
  });

  // Init avec URL
  updateInputs("url");
