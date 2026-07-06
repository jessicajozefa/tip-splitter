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
  let month = getMonthTotals();
  let alloc = {};
  let spainOverflow = 0;

  for (let k of ["insurance","tax","amex","rent","ira"]) {
    let value = amount * RATES[k];
    let remaining = CAPS[k] - month[k];

    if (remaining <= 0) {
      spainOverflow += value;
      alloc[k] = 0;
    } else if (value > remaining) {
      alloc[k] = remaining;
      spainOverflow += value - remaining;
    } else {
      alloc[k] = value;
    }
  }

  alloc.spain = amount * RATES.spain + spainOverflow;
  alloc.amount = amount;
  alloc.time = new Date().toISOString();

  return alloc;
}

function getMonthTotals() {
  let now = new Date();
  let m = now.getMonth();
  let y = now.getFullYear();

  let totals = {
    insurance:0,
    tax:0,
    amex:0,
    rent:0,
    ira:0,
    spain:0
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

  const last = tips[tips.length - 1];

  document.getElementById("result").innerHTML = last ? `
    <h3>Last Tip: $${last.amount.toFixed(2)}</h3>
    <p>Insurance: $${last.insurance.toFixed(2)}</p>
    <p>Taxes: $${last.tax.toFixed(2)}</p>
    <p>Amex: $${last.amex.toFixed(2)}</p>
    <p>Rent: $${last.rent.toFixed(2)}</p>
    <p>IRA: $${last.ira.toFixed(2)}</p>
    <p>Spain: $${last.spain.toFixed(2)}</p>
  ` : "";

  // Monthly dashboard
  console.log("MONTH TOTALS", month);
}

update();
