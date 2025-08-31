let datos = [];

// Leer CSV local
fetch("tags_fijos.csv")
.then(response => response.text())
.then(csvText => {
    const rows = csvText.split("\n").map(r => r.trim()).filter(r => r.length> 0);
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
  const botonDescarga = document.getElementById("descargarQR");

  resultadoDiv.textContent = "";
  qrCanvas.getContext("2d").clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  botonDescarga.style.display = "none";

  if (!placaInput) {
    resultadoDiv.textContent = "Ingrese una placa.";
    return;
}

  const registro = datos.find(item => item.PLACAS === placaInput);

  if (registro) {
    resultadoDiv.textContent = "TAG encontrado: " + registro.TAG;
    generarQR(registro.TAG);
    botonDescarga.style.display = "inline-block";
} else {
    let tagManual = prompt("Placas no encontradas. Ingrese manualmente el número de TAG:");
    if (tagManual) {
      tagManual = tagManual.trim().toUpperCase(); // Asegurar mayúsculas
      resultadoDiv.textContent = "TAG temporal generado: " + tagManual + " (solo válido para este viaje)";
      generarQR(tagManual);
      botonDescarga.style.display = "inline-block";
} else {
      resultadoDiv.textContent = "No se generó ningún TAG.";
}
}
}

function generarQR(texto) {
  const canvas = document.getElementById("qrcode");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  QRCode.toCanvas(canvas, texto, { width: 200}, function (error) {
    if (error) console.error(error);
});
}

function descargarQR() {
  const canvas = document.getElementById("qrcode");
  const enlace = document.createElement("a");
  enlace.download = "qr.png";
  enlace.href = canvas.toDataURL("image/png");
  enlace.click();
}