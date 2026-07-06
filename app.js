let tips = JSON.parse(localStorage.getItem("tips") || "[]");

function addTip() {
  const val = parseFloat(document.getElementById("amount").value);

  if (!val) return;

  tips.push({
    amount: val,
    time: new Date().toISOString()
  });

  localStorage.setItem("tips", JSON.stringify(tips));

  document.getElementById("amount").value = "";

  update();
}

function update() {
  let history = "";

  tips.forEach(t => {
    history += `
      <div style="padding:8px; border-bottom:1px solid #ddd;">
        <b>$${t.amount.toFixed(2)}</b>
        <div style="font-size:12px; color:gray;">
          Insurance: $${t.insurance.toFixed(2)} |
          Taxes: $${t.tax.toFixed(2)} |
          Amex: $${t.amex.toFixed(2)} |
          Rent: $${t.rent.toFixed(2)} |
          IRA: $${t.ira.toFixed(2)} |
          Spain: $${t.spain.toFixed(2)}
        </div>
      </div>
    `;
  });

  const total = tips.reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("result").innerHTML = `
    <h3>Total Tips: $${total.toFixed(2)}</h3>
    <hr>
    ${history || "No entries yet"}
  `;
}

  document.getElementById("result").innerHTML =
    html || "No entries yet";
}

update();
