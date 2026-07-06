const CAPS = {
  insurance: 622,
  tax: 600,
  amex: 2000,
  rent: 1500,
  ira: 200
};

let tips = JSON.parse(localStorage.getItem("tips") || "[]");

/* ---------------- MONTH TOTALS ---------------- */

function getMonthTotals() {
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();

  let totals = {
    insurance: 0,
    tax: 0,
    amex: 0,
    rent: 0,
    ira: 0,
    spain: 0
  };
  function deleteLast() {
  if (tips.length === 0) return;

  tips.pop();

  localStorage.setItem("tips", JSON.stringify(tips));
  update();
}

  tips.forEach(t => {
    const d = new Date(t.time);
    if (d.getMonth() === m && d.getFullYear() === y) {
      totals.insurance += t.insurance;
      totals.tax += t.tax;
      totals.amex += t.amex;
      totals.rent += t.rent;
      totals.ira += t.ira;
      totals.spain += t.spain || 0;
    }
  });

  return totals;
}

/* ---------------- ADD TIP ---------------- */

function addTip() {
  const input = document.getElementById("amount");
  const val = parseFloat(input.value);
  if (isNaN(val)) return;

  const totals = getMonthTotals();

  let remaining = val;

  const entry = {
    amount: val,
    insurance: 0,
    tax: 0,
    amex: 0,
    rent: 0,
    ira: 0,
    spain: 0,
    time: new Date().toISOString()
  };

  /* ---------------- PRIORITY ORDER ----------------
     Insurance ALWAYS first (your requirement)
  -------------------------------------------------- */

  const order = ["insurance", "tax", "amex", "rent", "ira"];

  for (let key of order) {
    const space = CAPS[key] - (totals[key] || 0);

    if (space <= 0) continue;

    const used = Math.min(space, remaining);

    entry[key] = used;
    remaining -= used;

    if (remaining <= 0) break;
  }

  /* ---------------- SPAIN OVERFLOW ---------------- */

  entry.spain = remaining;

  tips.push(entry);
  localStorage.setItem("tips", JSON.stringify(tips));

  input.value = "";
  update();
}

/* ---------------- UI ---------------- */

function update() {
  const total = tips.reduce((s, t) => s + t.amount, 0);

  let html = "";

  tips.slice().reverse().forEach(t => {
    html += `
      <div style="padding:10px;border-bottom:1px solid #eee;">
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

  renderProgress();
}

/* ---------------- PROGRESS BARS ---------------- */

function renderProgress() {
  const totals = getMonthTotals();

  let html = "";

  for (let key in CAPS) {
    const used = totals[key] || 0;
    const pct = Math.min(100, (used / CAPS[key]) * 100);

    let color = "black";
    if (pct > 80) color = "orange";
    if (pct > 95) color = "red";

    html += `
      <div style="margin-bottom:12px;">
        <strong>${key}</strong> $${used.toFixed(2)} / $${CAPS[key]}
        <div style="background:#eee;height:10px;border-radius:5px;">
          <div style="width:${pct}%;height:10px;background:${color};"></div>
        </div>
      </div>
    `;
  }

  html += `
    <div style="margin-top:16px;">
      <strong>Spain Fund</strong> $${(totals.spain || 0).toFixed(2)}
    </div>
  `;

  document.getElementById("progress").innerHTML = html;
}

/* ---------------- RESET ---------------- */

function bindReset() {
  const monthBtn = document.getElementById("resetMonth");
  const allBtn = document.getElementById("resetAll");

  if (monthBtn) {
    monthBtn.onclick = () => {
      const now = new Date();
      const m = now.getMonth();
      const y = now.getFullYear();

      tips = tips.filter(t => {
        const d = new Date(t.time);
        return !(d.getMonth() === m && d.getFullYear() === y);
      });

      localStorage.setItem("tips", JSON.stringify(tips));
      update();
    };
  }

  if (allBtn) {
    allBtn.onclick = () => {
      tips = [];
      localStorage.removeItem("tips");
      update();
    };
  }
}

/* ---------------- INIT ---------------- */

function init(document.getElementById("deleteLast").onclick = deleteLast;) {
  document.getElementById("saveBtn").onclick = addTip;
  bindReset();
  update();
}

document.addEventListener("DOMContentLoaded", init);
