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

  const entry = allocate(val);
  tips.push(entry);

  localStorage.setItem("tips", JSON.stringify(tips));

  document.getElementById("amount").value = "";

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
      overflowSpain += value;
      alloc[k] = 0;
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
  const month = getMonthTotals();
  const total = tips.reduce((sum, t) => sum + t.amount, 0);

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

  document.getElementById("result").innerHTML = `
    <h3>Total Tips: $${total.toFixed(2)}</h3>
    <hr>
    ${history || "No entries yet"}
  `;
}

update();
