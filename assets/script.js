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
