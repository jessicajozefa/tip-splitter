function addTip() {
  const val = parseFloat(document.getElementById("amount").value);

  if (!val) return;

  const result = document.getElementById("result");

  result.innerHTML = `
    <h3>Saved: $${val.toFixed(2)}</h3>
    <p>Insurance: $${(val * 0.1215).toFixed(2)}</p>
    <p>Taxes: $${(val * 0.12).toFixed(2)}</p>
    <p>Amex Payment: $${(val * 0.40).toFixed(2)}</p>
    <p>Rent: $${(val * 0.30).toFixed(2)}</p>
    <p>IRA: $${(val * 0.0391).toFixed(2)}</p>
    <p>Spain Fund: $${(val * 0.0194).toFixed(2)}</p>
  `;
}
