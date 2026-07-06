let tips = JSON.parse(localStorage.getItem("tips") || "[]");

function addTip() {
  const input = document.getElementById("amount");
  const val = parseFloat(input.value);

  if (isNaN(val)) return;

  const entry = {
    amount: val,
    insurance: val * 0.12,
    tax: val * 0.12,
    amex: val * 0.40,
    rent: val * 0.30,
    ira: val * 0.04,
    spain: val * 0.02,
    time: new Date().toISOString()
  };

  tips.push(entry);
  localStorage.setItem("tips", JSON.stringify(tips));

  input.value = "";
  update();
}

function update() {
  const total = tips.reduce((s, t) => s + t.amount, 0);

  let html = "";

  tips.slice().reverse().forEach(t => {
    html += `
      <div style="padding:10px; border-bottom:1px solid #eee;">
        <b>$${t.amount.toFixed(2)}</b><br/>
        <small>
          Insurance: $${t.insurance.toFixed(2)} |
          Taxes: $${t.tax.toFixed(2)} |
          Amex: $${t.amex.toFixed(2)} |
          Rent: $${t.rent.toFixed(2)} |
          IRA: $${t.ira.toFixed(2)} |
          Spain: $${t.spain.toFixed(2)}
        </small>
      </div>
    `;
  });

  document.getElementById("result").innerHTML = `
    <h2>Total: $${total.toFixed(2)}</h2>
    <hr/>
    ${html || "No entries yet"}
  `;
}

document.getElementById("saveBtn").addEventListener("click", addTip);

update();
