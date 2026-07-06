let tips = JSON.parse(localStorage.getItem("tips") || "[]");

const CAPS = {
  insurance: 622,
  tax: 600,
  amex: 2000,
  rent: 1500,
  ira: 200
};

const RATES = {
  insurance: 0.1215,
  tax: 0.12,
  amex: 0.40,
  rent: 0.30,
  ira: 0.0391,
  spain: 0.0194
};

function addTip() {
  const val = parseFloat(document.getElementById("amount").value);

  if (!val) return;

  tips.push({
    amount: val,
    time: new Date().toISOString(),
    insurance: 0,
    tax: 0,
    amex: 0,
    rent: 0,
    ira: 0,
    spain: 0
  });

  localStorage.setItem("tips", JSON.stringify(tips));

  document.getElementById("saveBtn").addEventListener("click", addTip);

  update();
}

function allocate(amount) {
  const totals = getMonthTotals();

  let alloc = {};
  let overflowSpain = 0;

  for (let k of ["insurance", "tax", "amex", "rent", "ira"]) {
    let value = amount * RATES[k];
    let remaining = CAPS[k] - totals[k];

    if (remaining <= 0) {
      alloc[k] = 0;
      overflowSpain += value;
    } else if (value > remaining) {
      alloc[k] = remaining;
      overflowSpain += value - remaining;
    } else {
      alloc[k] = value;
    }
  }

  alloc.spain = amount * RATES.spain + overflowSpain;
  alloc.amount = amount;
  alloc.time = new Date().toISOString();

  return alloc;
}

function getMonthTotals() {
  let now = new Date();
  let m = now.getMonth();
  let y = now.getFullYear();

  let totals = {
    insurance: 0,
    tax: 0,
    amex: 0,
    rent: 0,
    ira: 0,
    spain: 0
  };

  tips.forEach(t => {
    let d = new Date(t.time);

    if (d.getMonth() === m && d.getFullYear() === y) {
      for (let k in totals) {
        totals[k] += t[k] || 0;
      }
    }
  });

  return totals;
}

function update() {
  const total = tips.reduce((sum, t) => sum + t.amount, 0);

  let historyHTML = "";

  tips.slice().reverse().forEach(t => {
    historyHTML += `
      <div style="padding:10px; border-bottom:1px solid #eee;">
        <b>$${t.amount.toFixed(2)}</b>
        <div style="font-size:12px; color:#666;">
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

  document.getElementById("result").innerHTML = `
    <h2>Total Tips: $${total.toFixed(2)}</h2>
    <hr/>
    <h3>History</h3>
    ${historyHTML || "<p>No entries yet</p>"}
  `;
}

update();
document.getElementById("saveBtn").addEventListener("click", addTip);
