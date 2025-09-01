if (code) {
  try {
    const data = JSON.parse(code.data);
    if (JSON.stringify(data) !== JSON.stringify(lastValidData)) {
      lastValidData = data;
      let outputText = `<div>ID Transazione: ${data.transaction_id}</div>`;
      outputText += `<div>Negozio: ${data.store}</div>`;
      outputText += `<div>Data: ${new Date(data.date).toLocaleString()}</div>`;
      outputText += `<div>Metodo di pagamento: ${data.payment_method}</div>`;
      outputText += `<div style="margin-top: 10px;">Prodotti:</div>`;
      data.items.forEach((item) => {
        outputText += `<div class="item">- ${item.name}: ${
          item.quantity
        } x €${item.price.toFixed(2)} = €${(item.quantity * item.price).toFixed(
          2
        )}</div>`;
      });
      outputText += `<div class="total">Totale: €${data.total.toFixed(
        2
      )}</div>`;
      output.innerHTML = outputText; // Usa innerHTML invece di textContent
      resetButton.style.display = "block";
      downloadButton.style.display = "block";
      exitQRCode.style.display = "block";
      generateExitQRCode(data.transaction_id);
    }
  } catch (e) {
    output.textContent = `Errore nel parsing dei dati: ${code.data}`;
    resetButton.style.display = "none";
    downloadButton.style.display = "none";
    exitQRCode.style.display = "none";
  }
}

// STILE PDF
downloadButton.addEventListener("click", () => {
  if (lastValidData) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Imposta il font
    doc.setFont("courier", "normal");
    doc.setFontSize(16);

    // Intestazione
    doc.setTextColor(0, 0, 0); // Nero
    doc.text("Scontrino Digitale", 105, 20, { align: "center" }); // Centrato
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25); // Linea divisoria sotto il titolo

    // Dettagli dello scontrino
    doc.setFontSize(12);
    doc.text(`ID Transazione: ${lastValidData.transaction_id}`, 10, 35);
    doc.text(`Negozio: ${lastValidData.store}`, 10, 45);
    doc.text(`Data: ${new Date(lastValidData.date).toLocaleString()}`, 10, 55);
    doc.text(`Metodo di pagamento: ${lastValidData.payment_method}`, 10, 65);

    // Prodotti
    doc.setFontSize(12);
    doc.text("Prodotti:", 10, 75);
    doc.setLineWidth(0.2);
    doc.line(10, 77, 200, 77); // Linea divisoria sotto "Prodotti"
    let y = 85;
    lastValidData.items.forEach((item) => {
      doc.text(
        `- ${item.name}: ${item.quantity} x €${item.price.toFixed(2)} = €${(
          item.quantity * item.price
        ).toFixed(2)}`,
        10,
        y
      );
      y += 8;
    });

    // Totale
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0); // Verde per il totale
    doc.line(10, y, 200, y); // Linea divisoria sopra il totale
    doc.text(`Totale: €${lastValidData.total.toFixed(2)}`, 10, y + 10);

    // Piè di pagina (opzionale)
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Grigio
    doc.text("Grazie per il tuo acquisto!", 105, y + 20, { align: "center" });

    // Salva il PDF
    doc.save(`scontrino_${lastValidData.transaction_id}.pdf`);
  }
});
