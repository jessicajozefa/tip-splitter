let tips = JSON.parse(localStorage.getItem("tips") || "[]");

const CAPS = {
  rent: 1500,
  cc: 2000,
  tax: 600,
  insurance: 622,
  ira: 200
};

const RATES = {
  rent: 0.30,
  cc: 0.40,
  tax: 0.12,
  insurance: 0.1215,
  ira: 0.0391,
  spain: 0.0194
};

function addTip() {
  let val = parseFloat(document.getElementById("amount").value);
  if (!val) return;

  const entry = allocate(val);

  tips.push(entry);
  localStorage.setItem("tips", JSON.stringify(tips));

  document.getElementById("amount").value = "";
  update();
}

function allocate(amount) {
  let month = getMonthTotals();

  let alloc = {};
  let spain = 0;

  for (let key of ["insurance","tax","cc","rent","ira"]) {
    let remaining = CAPS[key] - month[key];

    let value = amount * RATES[key];

    if (remaining <= 0) {
      spain += value;
      alloc[key] = 0;
    } else if (value > remaining) {
      alloc[key] = remaining;
      spain += value - remaining;
    } else {
      alloc[key] = value;
    }
  }

  alloc.spain = amount * RATES.spain + spain;
  alloc.amount = amount;
  alloc.time = new Date().toLocaleString();

  return alloc;
}

function getMonthTotals() {
  let now = new Date();
  let m = now.getMonth();
  let y = now.getFullYear();

  let totals = {
    rent:0, cc:0, tax:0, insurance:0, ira:0
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
  let month = getMonthTotals();

  document.getElementById("dashboard").innerHTML = `
    🩺 Insurance: $${month.insurance.toFixed(2)} / ${CAPS.insurance}<br>
    🧾 Taxes: $${month.tax.toFixed(2)} / ${CAPS.tax}<br>
    💳 Amex: $${month.cc.toFixed(2)} / ${CAPS.cc}<br>
    🏠 Rent: $${month.rent.toFixed(2)} / ${CAPS.rent}<br>
    🏦 IRA: $${month.ira.toFixed(2)} / ${CAPS.ira}<br>
  `;

  let last = tips[tips.length - 1];

  document.getElementById("result").innerHTML = last
    ? `Last Tip: $${last.amount}`
    : "";
}

update();
