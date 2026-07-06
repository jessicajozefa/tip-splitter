function update() {
  let total = tips.reduce((sum, t) => sum + t.amount, 0);

  let historyHTML = "";

  for (let t of tips.slice().reverse()) {
    historyHTML += `
      <div style="padding:10px; border-bottom:1px solid #eee;">
        <b>$${t.amount.toFixed(2)}</b>
        <div style="font-size:12px; color:#666; margin-top:4px;">
          Insurance: $${t.insurance.toFixed(2)} |
          Taxes: $${t.tax.toFixed(2)} |
          Amex: $${t.amex.toFixed(2)} |
          Rent: $${t.rent.toFixed(2)} |
          IRA: $${t.ira.toFixed(2)} |
          Spain: $${t.spain.toFixed(2)}
        </div>
      </div>
    `;
  }

  document.getElementById("result").innerHTML = `
    <h2>Total Tips: $${total.toFixed(2)}</h2>
    <hr/>
    <h3>History</h3>
    ${historyHTML || "<p>No entries yet</p>"}
  `;
}
