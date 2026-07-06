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

let totals = {
  insurance: 0,
  tax: 0,
  amex: 0,
  rent: 0,
  ira: 0,
  spain: 0
};

function addTip() {
  const val = parseFloat(document.getElementById("amount").value);
  if (!val) return;

  let alloc = {};

  for (let k of ["insurance","tax","amex","rent","ira"]) {
    let add = val * RATES[k];

    if (totals[k] >= CAPS[k]) {
      totals.spain += add;
      alloc[k] = 0;
    } else if (totals[k] + add > CAPS[k]) {
      let remaining = CAPS[k] - totals[k];
      totals[k] += remaining;
      totals.spain += (add - remaining);
      alloc[k] = remaining;
    } else {
      totals[k] += add;
      alloc[k] = add;
    }
  }

  totals.spain += val * RATES.spain;

  render(val, alloc);
}

function render(val, alloc) {
  document.getElementById("result").innerHTML = `
    <h3>Saved: $${val.toFixed(2)}</h3>

    <p>Insurance: $${alloc.insurance.toFixed(2)}</p>
    <p>Taxes: $${alloc.tax.toFixed(2)}</p>
    <p>Amex: $${alloc.amex.toFixed(2)}</p>
    <p>Rent: $${alloc.rent.toFixed(2)}</p>
    <p>IRA: $${alloc.ira.toFixed(2)}</p>

    <hr>
    <p>🇪🇸 Spain Fund: $${totals.spain.toFixed(2)}</p>
  `;
}
