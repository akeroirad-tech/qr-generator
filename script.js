let datos = [];

// Leer CSV local
fetch("tags_fijos.csv")
  .then(response => response.text())
  .then(csvText => {
    const rows = csvText.split("\n").map(r => r.trim()).filter(r => r.length > 0);
    const headers = rows.shift().split(",");
    datos = rows.map(row => {
      const values = row.split(",");
      return {
        PLACAS: values[0]?.trim().toUpperCase(),
        TAG: values[1]?.trim()
      };
    });
    console.log("Datos cargados:", datos);
  })
  .catch(err => console.error("Error al cargar CSV:", err));

function buscarPlaca() {
  const placaInput = document.getElementById("placaInput").value.trim().toUpperCase();
  const resultadoDiv = document.getElementById("resultado");
  const qrCanvas = document.getElementById("qrcode");

  resultadoDiv.textContent = "";
  qrCanvas.getContext("2d").clearRect(0, 0, qrCanvas.width, qrCanvas.height);

  if (!placaInput) {
    resultadoDiv.textContent = "Ingrese una placa.";
    return;
  }

  const registro = datos.find(item => item.PLACAS === placaInput);

  if (registro) {
    resultadoDiv.textContent = "TAG encontrado: " + registro.TAG;
    QRCode.toCanvas(qrCanvas, registro.TAG, { width: 200 }, function (error) {
      if (error) console.error(error);
    });
  } else {
    const tagManual = prompt("Placas no encontradas. Ingrese manualmente el número de TAG:");
    if (tagManual) {
      resultadoDiv.textContent = "TAG temporal generado: " + tagManual + " (solo válido por esta ocasión)";
      QRCode.toCanvas(qrCanvas, tagManual, { width: 200 }, function (error) {
        if (error) console.error(error);
      });
    } else {
      resultadoDiv.textContent = "No se generó ningún TAG.";
    }
  }
}